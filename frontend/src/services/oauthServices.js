import ApiService from "./ApiService";
import { useUserStore } from "@/stores/user";

class OauthServices extends ApiService {
  get entity() {
    return "user";
  }

  async login(credential) {
    const { email, password } = credential;
    var data = {
      email: email,
      password: password,
    };
    console.log(data);
    return this.request({
      method: "post",
      url: `/${this.entity}/sign-in/`,
      data: data,
    });
  }
  async signup(credential) {
    const { name, email, password, confirmPassword, phone } = credential;
    var data = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      phone: phone,
    };
    console.log(data);
    return this.request({
      method: "post",
      url: `/${this.entity}/sign-up/`,
      data: data,
    });
  }

  async logout() {
    const state = useUserStore();
    const data = {
      access_token: state.user.access,
      refresh_token: state.user.refresh,
    };
    const option = {
      method: "post",
      url: `/${this.entity}/logout/`,
      data: data,
    };
    return this.request(option);
  }

  async gets(access) {
    const option = {
      method: "get",
      url: `/${this.entity}/getall/`,
      headers: {
        Authorization: `Bearer ${access}`,
      },
    };
    return this.request(option);
  }

  async getme(access, id) {
    console.log(access);

    const option = {
      method: "get",
      url: `/${this.entity}/detail-user/${id}/`,
      headers: {
        Authorization: `Bearer ${access}`,
      },
    };
    return this.request(option);
  }

  async updateProfile(id, data) {
    var data = {
      name: data.name,
      phone: data.phone,
      email: data.email,
    };
    console.log("data update", data);

    return this.request({
      method: "put",
      url: `/${this.entity}/update-user/${id}/`,
      data: data,
    });
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
}

export default new OauthServices();
