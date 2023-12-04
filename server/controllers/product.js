const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  // if (req.body && req.body.title) {
  //   req.body.slug = slugify(req.body.title, "_");
  // }
  const { title } = req.body;
  const existingProduct = await Product.findOne({ title });
  if (existingProduct) {
    return res.status(400).json({
      success: false,
      error: "Product with this title already exists",
    });
  }
  // Generate slug based on the title
  const slug = slugify(title, "-");
  req.body.slug = slug;
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createProduct: newProduct ? newProduct : "Cannot create new product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productDetail: product ? product : "Cannot get product",
  });
});

//filter pagination sorting limit
const getProductList = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const exludeFields = ["limit", "sort", "page", "fields"];
  exludeFields.forEach((el) => delete queries[el]);

  queries.status = 1;

  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatQueries = JSON.parse(queryString);

  //filter
  if (queries?.title)
    formatQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formatQueries);

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  } else {
    queryCommand = queryCommand.sort("-createdAt");
  }

  //field
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  } else {
    queryCommand = queryCommand.select("-__v");
  }

  //pagination - limit
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  queryCommand
    .then(async (response) => {
      const counts = await Product.find(formatQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        productList: response ? response : "Cannot get product list",
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
  // queryCommand.exec(async (err, response) => {
  //   if (err) throw new Error(err.message);
  //   const counts = await Product.find(formatQueries).countDocuments();
  //   return res.status(200).json({
  //     success: response ? true : false,
  //     productList: response ? response : "Cannot get product list",
  //     counts,
  //   });
  // });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title, "_");
  const product = await Product.findByIdAndUpdate(pid, req.body, { new: true });
  return res.status(200).json({
    success: product ? true : false,
    productDetail: product ? product : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: product ? true : false,
    productDeleted: product ? "Deleted Success" : "Cannot delete product",
  });
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing Input");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.rating?.find(
    (el) => el.postBy.toString() === _id
  );
  if (alreadyRating) {
    //update comment, star
    await Product.updateOne(
      {
        rating: { $elemMatch: alreadyRating },
      },
      {
        $set: { "rating.$.star": star, "rating.$.comment": comment },
      },
      { new: true }
    );
  } else {
    //add star, comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { rating: { star, comment, postBy: _id } },
      },
      { new: true }
    );
  }

  const updatedTotalRating = await Product.findById(pid);
  const ratingCount = updatedTotalRating.rating.length;
  const sumRating = updatedTotalRating.rating.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedTotalRating.totalRating =
    Math.round((sumRating * 10) / ratingCount) / 10;
  await updatedTotalRating.save();
  return res.status(200).json({
    status: true,
    updatedTotalRating,
  });
});

const uploadImgProduct = asyncHandler(async (req, res) => {
  // console.log(req.files)
  // return res.json("oke")
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing Input");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { image: { $each: req.files.map((el) => el.path) } },
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    product: response ? response : "Cannot upload image",
  });
});



module.exports = {
  createProduct,
  getProduct,
  getProductList,
  updateProduct,
  deleteProduct,
  rating,
  uploadImgProduct,
};
