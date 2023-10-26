import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { LMap, LTileLayer, LMarker, LMarkerClusterGroup } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import router from './router'

const app = createApp(App)
app.use(VueAxios, axios)
app.config.productionTip = false
app.component('l-map', LMap)
app.component('l-tile-layer', LTileLayer)
app.component('l-marker', LMarker)
app.component('l-markerClusterGroup', LMarkerClusterGroup)

app.use(router)
app.mount('#app')
