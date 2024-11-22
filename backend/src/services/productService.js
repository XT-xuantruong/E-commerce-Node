const Product = require("../models/productModel");

// const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      thumbnail,
      images,
      price,
      countInStock,
      description,
      category,
    } = newProduct;

    try {
      const createdProduct = await Product.create({
        name,
        thumbnail,
        images,
        price,
        countInStock,
        description,
        category,
      });

      if (createdProduct) {
        resolve({
          status: "ok",
          messsage: "Product created successfully",
          data: createdProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });
      console.log(checkProduct);

      if (checkProduct === null) {
        resolve({
          status: "ok",
          messsage: "The product is not existing",
        });
      }

      const updateProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "ok",
        messsage: "Successfully",
        data: updateProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });

      if (checkProduct === null) {
        resolve({
          status: "ok",
          messsage: "The product is not existing",
        });
      }

      const deleteProduct = await Product.findByIdAndDelete(id);

      resolve({
        status: "ok",
        messsage: "delete Successfully",
        data: deleteProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("f", filter);

      const totalProduct = await Product.estimatedDocumentCount();
      if (filter) {
        const [field, value] = filter;

        const query =
          field === "category"
            ? { [field]: value }
            : { [field]: { $regex: value, $options: "i" } };
        const allProductFilter = await Product.find(query)
          .limit(limit)
          .skip(page * limit);

        const totalProductFilter = await Product.countDocuments(query);

        resolve({
          status: "ok",
          messsage: "Get all successfully",
          totalProduct: totalProductFilter,
          pageCurent: Number(page + 1),
          totalPage: Math.ceil(totalProductFilter / limit),
          data: allProductFilter,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);

        resolve({
          status: "ok",
          messsage: "Get all successfully",
          totalProduct: totalProduct,
          pageCurent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
          data: allProductSort,
        });
      }
      const all = await Product.find()
        .limit(limit)
        .skip(page * limit);

      resolve({
        status: "ok",
        messsage: "Get all successfully",
        totalProduct: totalProduct,
        pageCurent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
        data: all,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });

      if (product === null) {
        resolve({
          status: "ok",
          messsage: "The product is not existing",
        });
      }

      resolve({
        status: "ok",
        messsage: "Get detail successfully",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailProduct,
};
