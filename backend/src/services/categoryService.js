const Category = require("../models/categoryModel");

// const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");

const createCategory = (newCategory) => {
  return new Promise(async (resolve, reject) => {
    const { title, parent_id } = newCategory;

    try {
      const createdCategory = await Category.create({
        title,
        parent_id,
      });

      if (createdCategory) {
        resolve({
          status: "ok",
          messsage: "Category created successfully",
          data: createdCategory,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCategory = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({ _id: id });
      console.log(checkCategory);

      if (checkCategory === null) {
        resolve({
          status: "ok",
          messsage: "The category is not existing",
        });
      }

      const updateCategory = await Category.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "ok",
        messsage: "Successfully",
        data: updateCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({ _id: id });

      if (checkCategory === null) {
        resolve({
          status: "ok",
          messsage: "The category is not existing",
        });
      }

      const deleteCategory = await Category.findByIdAndDelete(id);

      resolve({
        status: "ok",
        messsage: "delete Successfully",
        data: deleteCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const all = await Category.find();

      resolve({
        status: "ok",
        messsage: "Get all successfully",
        data: all,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findOne({ _id: id });

      if (category === null) {
        resolve({
          status: "ok",
          messsage: "The category is not existing",
        });
      }

      resolve({
        status: "ok",
        messsage: "Get detail successfully",
        data: category,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getDetailCategory,
};
