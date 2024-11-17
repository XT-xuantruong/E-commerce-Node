import CartView from "@/views/guest/CartView.vue";
import CategoryView from "@/views/guest/CategoryView.vue";
import CheckoutView from "@/views/guest/CheckoutView.vue";
import HomeView from "@/views/guest/HomeView.vue";
import LoginView from "@/views/guest/LoginView.vue";
import MyAccountView from "@/views/guest/MyAccountView.vue";
import NotFoundView from "@/views/guest/NotFoundView.vue";
import ProductDetailView from "@/views/guest/ProductDetailView.vue";
import SearchView from "@/views/guest/SearchView.vue";
import SignupView from "@/views/guest/SignupView.vue";

export const publicRoutes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/category/:categorySlug/:page(\\d+)?",
    name: "category",
    component: CategoryView,
  },
  {
    path: "/product/:id",
    name: "product-detail",
    component: ProductDetailView,
  },
  {
    path: "/search",
    name: "search",
    component: SearchView,
  },
  {
    path: "/cart",
    name: "cart",
    component: CartView,
  },
  {
    path: "/myaccount",
    name: "myaccount",
    component: MyAccountView,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutView,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFoundView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: SignupView,
  },
];
