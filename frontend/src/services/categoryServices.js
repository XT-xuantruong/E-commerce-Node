import ApiService from "./ApiService";

class CategoryServices extends ApiService {
  get entity() {
    return "category";
  }
}

export default new CategoryServices();
