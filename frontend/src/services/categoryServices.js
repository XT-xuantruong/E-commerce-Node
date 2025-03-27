import { useAdminStore } from "@/stores/admin";
import ApiService from "./ApiService";

class CategoryServices extends ApiService {
  get entity() {
    return "categories";
  }
  async gets() {
    let option = {
      method: "get",
      url: `/${this.entity}/`,
    };
    return this.request(option);
  }
  async create(data) {
    const adminStore = useAdminStore();
    return this.request({
      method: "post",
      url: `/${this.entity}/`,
      data: data,
      headers: {
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    });
  }
  async update(data) {
    const adminStore = useAdminStore();
    const { category_id } = data;
    return this.request({
      method: "put",
      url: `/${this.entity}/${category_id}`,
      data: data,
      headers: {
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    });
  }

  async delete(id) {
    const adminStore = useAdminStore();
    console.log(adminStore.admin.access);

    return this.request({
      method: "delete",
      url: `/${this.entity}/${id}`,
      headers: {
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    });
  }
}

export default new CategoryServices();
