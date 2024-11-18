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
  async verifiOtp(credential) {
    const { otp } = credential;
    var data = {
      otp: otp,
    };
    console.log(data);
    return this.request({
      method: "post",
      url: `/${this.entity}/verify-email/`,
      data: data,
    });
  }
  async resendOtp(credential) {
    var data = {
      email: credential,
    };
    console.log(data);
    return this.request({
      method: "post",
      url: `/${this.entity}/re-generateotp/`,
      data: data,
    });
  }

  async googleSignup(credential) {
    var data = {
      access_token: credential,
    };
    console.log(data);
    return this.request({
      method: "post",
      url: `/${this.entity}/google/`,
      data: data,
    });
  }

  async logout() {
    const state = useUserStore();
    const data = {
      refresh: state.user.refresh,
    };
    const option = {
      method: "post",
      url: `/${this.entity}/blacklist/`,
      data: data,
    };
    return this.request(option);
  }

  async getme(access, id) {
    const option = {
      method: "get",
      url: `/${this.entity}/detail-user/${id}/`,
      headers: {
        Authorization: `Bearer ${access}`,
      },
    };
    return this.request(option);
  }

  async sendFriendshipRequest(id) {
    return this.request({
      method: "post",
      url: `/${this.entity}/friends/${id}/request/`,
    });
  }

  async handleFriendshipRequest(status, pk) {
    return this.request({
      method: "post",
      url: `/${this.entity}/friends/${pk}/${status}/`,
    });
  }
  async getFriendshipRequest(pk) {
    return this.request({
      method: "get",
      url: `/${this.entity}/friends/${pk}/`,
    });
  }

  async getFriendSuggest() {
    return this.request({
      method: "get",
      url: `/${this.entity}/friends/suggested/`,
    });
  }

  async updateProfile(data) {
    console.log("data update", data);

    return this.request({
      method: "post",
      url: `/${this.entity}/editprofile/`,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async changePassword(formdata) {
    return this.request({
      method: "post",
      url: `/${this.entity}/editpassword/`,
      data: formdata,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new OauthServices();
