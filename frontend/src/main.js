import './assets/css/style.css'


import { createApp } from "vue";
import { createPinia } from "pinia";
import VueApexCharts from 'vue3-apexcharts'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
library.add(fas)

app.use(createPinia());
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(VueApexCharts)
app.mount("#app");