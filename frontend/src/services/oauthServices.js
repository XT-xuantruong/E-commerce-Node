import ApiService from "./ApiService";
import { useUserStore } from "@/stores/user";

class OauthServices extends ApiService {
  get entity() {
    return "auth";
  }

  async login(credential) {
    const { email, password } = credential;
    var data = {
      username: email,
      password: password,
      scope: "",
      grant_type: "password",
      client_id: "string",
      client_secret: "string",
    };
    console.log(data);
    return this.request({
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      url: `/${this.entity}/login`,
      data: data,
    });
  }
  async signup(credential) {
    const { full_name, email, password, address, phone } = credential;
    var data = {
      full_name: full_name,
      email: email,
      password: password,
      address: address,
      phone: phone,
    };
    console.log(data);
    return this.request({
      method: "post",
      url: `/${this.entity}/register`,
      data: data,
    });
  }

  async logout(access, refresh) {
    const data = {
      access_token: access,
      refresh_token: refresh,
    };
    const option = {
      method: "post",
      url: `/${this.entity}/logout`,
      headers: {
        Authorization: `Bearer ${access}`,
      },
      data: data,
    };
    return this.request(option);
  }



  async getme(access, id) {
    const user = useUserStore();

    const option = {
      method: "get",
      url: `/${this.entity}/detail-user/${id}/`,
      headers: {
        Authorization: `Bearer ${user.user.access}`,
      },
    };
    return this.request(option);
  }

  async updateProfile(id, data) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    console.log("FormData for update", formData);

    return this.request({
      method: "put",
      url: `/${this.entity}/update-user/${id}/`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
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
