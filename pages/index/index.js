const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

Page({
  data: {
    imageName: '/images/sunny-bg.png',
    nowTemp: '12°',
    nowWeather: '多云',
    hourlyWeather: [],
    todayTemp: "",
    todayDate: "",
    city: "上海市"
  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    })
  },
  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'XP3BZ-VBE3S-HNWOO-6OBX3-64QCS-HPFKU'
    })
    console.log("jump here")
    this.getNow()
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '上海市'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        let result = res.data.result;
        this.setNow(result);
        this.setHourlyWeather(result);
        this.setToday(result);
        complete: () => {
          callback && callback();
        }
      }
    })
  },
  setNow(result) {
    let temp = result.now.temp;
    let weather = result.now.weather;
    this.setData({
      imageName: '/images/' + weather + '-bg.png',
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather]
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourlyWeather(result) {
    let nowHour = new Date().getHours();
    let forecast = result.forecast
    let hourlyWeather = [];
    for (let i = 0; i < 7; i++) {
      hourlyWeather.push({
        time: (i*3 + nowHour) % 24 + '时',
        path: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(result) {
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },
  onTapLocation() {
    console.log("jump here 1")
    wx.getLocation({
      success: res => {
        console.log("jump here 2")
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            console.log("jump here 3")
            let city = res.result.address_component.city
            console.log(city)
          }
        })
      }
    })
  },
})