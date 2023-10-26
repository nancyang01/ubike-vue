<template>
  <div class="container h-100">
    <div class="row h-100 pt-3">
      <div class="col-md-3 h-100">
        <h3>台北市YouBike <br>
          車輛數量查詢</h3>
        <div class="mb-2">
          <select class="form-select form-select-xs" aria-label=".form-select-lg example" v-model="cacheSearch" @change="updateSelect">
            <option selected value="" disabled>請選擇地區</option>
            <option v-for="(item,key) in area" :key="'area'+key" :value="item">{{item}}</option>
          </select>
        </div>
        <div class="card" v-if="!cacheSearch">
          <div class="d-flex align-items-center justify-content-center text-white warn">
            <p>請選擇地區</p>
          </div>
        </div>
        <div class="option">
          <div class="list-group" v-for="(item,key) in filterSearch" :key="'filter'+key" @click.prevent="cacheStation(item)">
            <a href="#" class="list-group-item" aria-current="true" :class="{'active': cacheArea.sna === item.sna}">
              <strong style="font-size: 20px;">{{item.sna}}</strong><br>
              地區: {{item.sarea}}<br>
              總停車格: {{item.tot}}<br>
              空位數量: {{item.bemp}}<br>
              目前車輛數量: {{item.sbi}}<br>
              <small>最後更新時間: {{item.mday}}</small>
            </a>
          </div>
        </div>
      </div>
      <div class="col-9">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
let openStreetMap = {}
// let bike
const iconsConfig = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}
const icons = {
  red: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    ...iconsConfig
  }),
  blue: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    ...iconsConfig
  })
}

export default {
  data () {
    return {
      dataStore: [],
      cacheArea: '',
      cacheSearch: '',
      searchRoad: '',
      area: ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區', '臺大公館校區']
    }
  },
  methods: {
    updateMap () {
      openStreetMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          openStreetMap.removeLayer(layer)
        }
      })

      this.filterSearch.forEach((item) => {
        const icon = item.sbi || 0 ? icons.blue : icons.red
        const latlng = L.latLng(item.lat, item.lng)
        L.marker(latlng, { icon })
          .addTo(openStreetMap)
          .bindPopup(`<p><strong style="font-size: 20px;">${item.sna}</strong></p>
          地區: ${item.sarea}<br>
          總停車格: ${item.tot}<br>
          空位數量: ${item.bemp}<br>
          目前車輛數量: ${item.sbi}<br>
          <small>最後更新時間: ${item.mday}</small>`)
      })
    },
    updateSelect () {
      const area = this.dataStore.find((item) => {
        return item.sarea === this.cacheSearch
      })
      const latlng = L.latLng(area.lat, area.lng)
      openStreetMap.panTo(latlng)
    },
    cacheStation (item) {
      this.cacheArea = item
      const latlng = L.latLng(item.lat, item.lng)
      openStreetMap.panTo(latlng).setZoom(16)
      const icon = item.sbi || 0 ? icons.blue : icons.red
      L.marker(latlng, { icon })
        .addTo(openStreetMap)
        .bindPopup(`<p><strong style="font-size: 20px;">${item.sna}</strong></p>
          地區: ${item.sarea}<br>
          總停車格: ${item.tot}<br>
          空位數量: ${item.bemp}<br>
          目前車輛數量: ${item.sbi}<br>
          <small>最後更新時間: ${item.mday}</small>`).openPopup()
    }
  },
  computed: {
    filterSearch () {
      return this.dataStore.filter((item) => {
        if (item.sarea === this.cacheSearch) {
          return item.sna
        }
        return false
      })
    }
  },
  watch: {
    filterSearch () {
      this.updateMap()
    }
  },
  mounted () {
    const url = 'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json'
    this.$http.get(url).then((res) => {
      // console.log(res.data)
      this.dataStore = res.data
      this.updateMap()
    })
    openStreetMap = L.map('map', {
      center: [25.03, 121.55],
      // 可以嘗試改變 zoom 的數值
      // 筆者嘗試後覺得 18 的縮放比例是較適當的查詢範圍
      zoom: 13
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18
    }).addTo(openStreetMap)
  }
}
</script>
