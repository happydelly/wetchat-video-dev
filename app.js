//app.js
App({
  serverUrl: "http://localhost:8081", 
  //serverUrl: "http://fff3bg.natappfree.cc",
  userInfo: null,
  setGlobalUserInfo: function(user){
    wx.setStorageSync("userInfo", user)
  },
  getGlobalUserInfo: function () {
   return wx.getStorageSync("userInfo")
  }
})