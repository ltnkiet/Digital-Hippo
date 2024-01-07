const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI_PRODUCTION);
    if (conn.connection.readyState == 1)
      console.log("DB connection is successfully");
    else console.log("DB connection failed");
  } catch (error) {
    console.log("DB connection failed");
    throw new Error(error);
  }
};

module.exports = dbConnect;
