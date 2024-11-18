import ApiService from "./ApiService";

class ProductServices extends ApiService {
  get entity() {
    return "product";
  }
}

export default new ProductServices();
