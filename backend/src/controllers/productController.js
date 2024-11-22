const productService = require("../services/productService");
// const jwtService = require("../services/jwtService");

const createProduct = async (req, res) => {
  try {
    console.log("Request Files:", req.files);
    let ProductData = {
      ...req.body,
      thumbnail: req.files?.thumbnail
        ? req.files.thumbnail[0].path
            .replace(/\\/g, "/")
            .replace(/^.*\/uploads/, "uploads")
        : null,
      images: req.files?.images
        ? req.files.images.map((file) =>
            file.path.replace(/\\/g, "/").replace(/^.*\/uploads/, "uploads")
          )
        : [],
    };

    if (
      !ProductData.name ||
      !ProductData.price ||
      !ProductData.countInStock ||
      !ProductData.description ||
      !ProductData.category ||
      !ProductData.thumbnail ||
      ProductData.images.length === 0
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    console.log("Processed Product Data:", ProductData);

    const response = await productService.createProduct(ProductData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const Id = req.params.id;
    console.log("id: " + Id);
    if (!Id) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const data = req.body;
    data.thumbnail = req.files?.thumbnail
      ? req.files.thumbnail[0].path
          .replace(/\\/g, "/")
          .replace(/^.*\/uploads/, "uploads")
      : null;
    data.images = req.files?.images
      ? req.files.images.map((file) =>
          file.path.replace(/\\/g, "/").replace(/^.*\/uploads/, "uploads")
        )
      : [];

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
