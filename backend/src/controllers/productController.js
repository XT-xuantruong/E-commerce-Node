const productService = require("../services/productService");
// const jwtService = require("../services/jwtService");

const createProduct = async (req, res) => {
  try {
    let ProductData;
    const contentType = req.headers["content-type"];

    if (contentType.includes("application/json")) {
      ProductData = req.body;
    } else if (contentType.includes("multipart/form-data")) {
      ProductData = req.fields;
    }
    const { name, image, price, countInStock, description, category } =
      ProductData;
    // console.log(email);

    if (
      !name ||
      !price ||
      !countInStock ||
      !description ||
      !category
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await productService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const Id = req.params.id;
    console.log("id: " + Id);
    const data = req.body;
    if (!Id) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await productService.updateProduct(Id, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const Id = req.params.id;
    // const token = req.headers;
    const response = await productService.deleteProduct(Id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await productService.getAllProduct(
      Number(limit),
      Number(page),
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const getDetailProduct = async (req, res) => {
  try {
    const Id = req.params.id;
    console.log(Id);

    if (!Id) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await productService.getDetailProduct(Id);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailProduct,
};
