import HomeView from '@/views/HomeView.vue'
import CategoryView from '@/views/CategoryView.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import CartView from '@/views/CartView.vue'
import SearchView from '@/views/SearchView.vue'
import MyAccountView from '@/views/MyAccountView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import BlogView from '@/views/BlogView.vue'
import BlogDetail from '@/views/BlogDetail.vue'
import NotFound from '@/views/NotFound.vue'
import LoginView from "@/views/LoginView.vue";
import SignupView from '@/views/SignupView.vue'
import VerifyEmailView from '@/views/VerifyEmailView.vue'


export const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/category/:categorySlug/:page(\\d+)?',
    name: 'category',
    component: CategoryView,
    props: true,
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetail,
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
  },
  {
    path: '/myaccount',
    name: 'myaccount',
    component: MyAccountView,
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: { requiresAuth: true },
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
  },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: BlogDetail,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name:'register',
    component: SignupView,
  },
  {
    path: '/verifyOtp',
    name:'verifyOtp',
    component: VerifyEmailView,
  }
]