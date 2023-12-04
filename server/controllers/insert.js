const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const data = require("../../data/data2.json");
const slugify = require("slugify");
const catedata = require("../../data/cate_brand");
const Category = require("../models/category");

const fn = async (product) => {
  await Product.create({
    title: product?.name,
    slug: slugify(product?.name),
    description: product?.description,
    brand: product?.brand,
    price: Math.round(Number(product?.price.match(/\d/g).join("")) / 100),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 1000),
    thumb: product?.thumb,
    images: product?.images,
    color: product?.variants?.find((el) => el.label === "Color")?.variants[0],
    status: 1,
  });
};

const fn2 = async (category) => {
  await Category.create({
    name: category?.name,
    brand: category?.brand,
  });
};

const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of data) promises.push(fn(product));
  await Promise.all(promises);
  return res.json("DONE");
});

const insertCategory = asyncHandler(async (req, res) => {
  const promises = [];
  for (let category of catedata) promises.push(fn2(category));
  await Promise.all(promises);
  return res.json("CATEGORY DONE");
});

module.exports = { insertProduct, insertCategory };
