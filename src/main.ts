import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import 'v-calendar/style.css'
import VCalendar from 'v-calendar'

const app = createApp(App)
app.use(VCalendar, {})
app.use(router).mount('#app')
