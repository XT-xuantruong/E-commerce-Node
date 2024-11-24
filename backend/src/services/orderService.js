const Order = require("../models/orderModel");

// const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");

const createOrder = (newProduct) => {
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
      const createdProduct = await Order.create({
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

const updateOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Order.findOne({ _id: id });
      console.log(checkProduct);

      if (checkProduct === null) {
        resolve({
          status: "ok",
          messsage: "The product is not existing",
        });
      }

      const updateProduct = await Order.findByIdAndUpdate(id, data, {
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

const deleteOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Order.findOne({ _id: id });

      if (checkProduct === null) {
        resolve({
          status: "ok",
          messsage: "The product is not existing",
        });
      }

      const deleteProduct = await Order.findByIdAndDelete(id);

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

const getAllOrder = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Filter:", filter);
      console.log("Sort:", sort);

      // Tạo query mặc định
      let query = {};
      if (Array.isArray(filter) && filter.length === 2) {
        const [field, value] = filter;
        query =
          field === "category"
            ? { [field]: value }
            : { [field]: { $regex: value, $options: "i" } };
      }

      // Tạo object sort mặc định
      let objectSort = {};
      if (Array.isArray(sort) && sort.length === 2) {
        objectSort[sort[1]] = sort[0];
      }

      // Lấy danh sách sản phẩm
      const allProducts = await Product.find(query)
        .sort(objectSort) // Áp dụng sort nếu có
        .limit(limit)
        .skip(page * limit);

      // Tổng số sản phẩm theo query
      const totalProductFiltered = await Order.countDocuments(query);

      // Tổng số sản phẩm trong cơ sở dữ liệu
      const totalProduct = await Order.estimatedDocumentCount();

      resolve({
        status: "ok",
        message: "Get all successfully",
        totalProduct: filter ? totalProductFiltered : totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(
          (filter ? totalProductFiltered : totalProduct) / limit
        ),
        data: allProducts,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Order.findOne({ _id: id });

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
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrder,
  getDetailOrder,
};