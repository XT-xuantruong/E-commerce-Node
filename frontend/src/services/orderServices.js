import ApiService from "./ApiService";
import { useAdminStore } from "@/stores/admin";

class OrderServices extends ApiService {
  get entity() {
    return "order";
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

  async delete(id) {
    const adminStore = useAdminStore();
    return this.request({
      method: "delete",
      url: `/${this.entity}/${id}/`,
      headers: {
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    });
  }
}

export default new OrderServices();
