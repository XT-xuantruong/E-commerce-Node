import ApiService from "./ApiService";
import { useAdminStore } from "@/stores/admin";

class ProductServices extends ApiService {
  get entity() {
    return "products";
  }
  async update(data) {
    const adminStore = useAdminStore();
  
    const { product_id } = data;
  
    // Chuẩn bị dữ liệu JSON theo schema ProductCreate
    const productData = {
      name: data.name,
      price: data.price,
      description: data.description,
      category_id: data.category_id,
      stock: data.stock,
      images: [],
    };
  
    // Xử lý danh sách images
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, i) => {
        productData.images.push({
          image_url: image, // Giả sử image là chuỗi URL hoặc base64
          is_primary: i === 0, // Gán ảnh đầu tiên là primary, bạn có thể thay đổi logic này
        });
      });
    }
  
    const option = {
      method: "put",
      url: `/${this.entity}/${product_id}`,
      data: productData,
      headers: {
        "Content-Type": "application/json", // Đổi thành JSON
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    };
    return this.request(option);
  }

  async create(data) {
    const adminStore = useAdminStore();

    // Chuẩn bị dữ liệu JSON theo schema ProductCreate
    const productData = {
        name: data.name,
        price: data.price,
        description: data.description,
        category_id: data.category_id,
        stock: data.stock,
        images: [],
    };

    // Xử lý danh sách images
    if (data.images && data.images.length > 0) {
        data.images.forEach((image, i) => {
            productData.images.push({
                image_url: image, // Giả sử image là chuỗi URL hoặc Base64
                is_primary: i === 0, // Gán ảnh đầu tiên là primary
            });
        });
    }

    const option = {
        method: "post",
        url: `/${this.entity}/`, // Ví dụ: "/api/products/"
        data: productData,
        headers: {
            "Content-Type": "application/json", // Gửi dưới dạng JSON
            Authorization: `Bearer ${adminStore.admin.access}`,
        },
    };

    return this.request(option);
}

  async gets() {
    const adminStore = useAdminStore();

    let option = {
      method: "get",
      url: `/${this.entity}/`,
      Authorization: `Bearer ${adminStore.admin.access}`,
    };
    return this.request(option);
  }

  async delete(id) {
    const adminStore = useAdminStore();
    return this.request({
      method: "delete",
      url: `/${this.entity}/${id}`,
      headers: {
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    });
  }
}

export default new ProductServices();
