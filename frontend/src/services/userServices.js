import ApiService from "./ApiService";
import { useUserStore } from "@/stores/user";

class UserServices extends ApiService {
  get entity() {
    return "users";
  }

  async getme(access = "") {
    if (access == "") {
      const user = useUserStore();
      const option = {
        method: "get",
        url: `/${this.entity}/me`,
        headers: {
          Authorization: `Bearer ${user.user.access}`,
        },
      };
      return this.request(option);
    } else {
      const option = {
        method: "get",
        url: `/${this.entity}/me`,
        headers: {
          Authorization: `Bearer ${access}`,
        },
      };
      return this.request(option);
    }
  }

  async updateProfile(data) {
    const user = useUserStore();

    return this.request({
      method: "put",
      url: `/${this.entity}/me`,
      headers: {
        Authorization: `Bearer ${user.user.access}`,
      },
      data: data,
    });
  }

  async gets(access) {
    const option = {
      method: "get",
      url: `/${this.entity}/`,
      headers: {
        Authorization: `Bearer ${access}`,
      },
    };
    return this.request(option);
  }

  async delete(id, access) {
    return this.request({
      method: "delete",
      url: `/${this.entity}/delete-user/${id}/`,
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
  }

  async uploadAvatar(file) {
    const user = useUserStore();
    const formData = new FormData();
    formData.append("file", file); 
  
    return this.request({
      method: "put",
      url: `/${this.entity}/me/avatar`,
      headers: {
        Authorization: `Bearer ${user.user.access}`,
      },
      data: formData,
    });
  }
}

export default new UserServices();
