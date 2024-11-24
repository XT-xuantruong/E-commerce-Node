const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");

const createOrder = (orderData) => {
  console.log(orderData);

  return new Promise(async (resolve, reject) => {
    try {
      const validatedItems = await Promise.all(
        orderData.orderItems.map(async (item) => {
          const product = await Product.findById(item._id);
          console.log(product);

          return {
            name: product.name,
            amount: item.quantity,
            image: item.image,
            price: product.price,
            product: product._id,
            priceAtOrder: product.price,
          };
        })
      );

      const order = new Order({
        orderItems: validatedItems,
        shippingAddress: orderData.shippingAddress,
        itemsPrice: orderData.itemsPrice,
        shippingPrice: orderData.shippingPrice,
        taxPrice: orderData.taxPrice,
        totalPrice: orderData.totalPrice,
        user: orderData.user,
        orderStatus: "Pending",
      });

      const savedOrder = await order.save();

      await Promise.all(
        validatedItems.map(async (item) => {
          await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: { countInStock: -item.amount },
            },
            { new: true }
          );
        })
      );

      resolve({
        status: "OK",
        message: "Successfully created order",
        data: savedOrder,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const updateOrder = (id, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({ _id: id });

      if (checkOrder === null) {
        resolve({
          status: "ERR",
          message: "The order is not existing",
        });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { orderStatus: status },
        { new: true }
      );
      // ).populate('user', 'name email')
      //   .populate('orderItems.product', 'name price');

      resolve({
        status: "OK",
        message: "Successfully updated order status",
        data: updatedOrder,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const deleteOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({ _id: id });

      if (checkOrder === null) {
        resolve({
          status: "ok",
          message: "The order is not existing",
        });
      }

      const deletedOrder = await Order.findByIdAndDelete(id);

      resolve({
        status: "ok",
        message: "Successfully deleted order",
        data: deletedOrder,
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
