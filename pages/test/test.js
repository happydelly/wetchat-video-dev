Page({
  /**
   * 页面的初始数据
   */
  data: {
    songList: [
      { src: "http://www.itzixi.com:88/download/timian.mp3", songName: "体面", singer: "于文文", duration: "4:43" },
      { src: encodeURI("http://www.itzixi.com:88/download/林俊杰-江南.mp3"), songName: "江南", singer: "林俊杰", duration: "4:23" },
      { src: encodeURI("http://www.itzixi.com:88/download/薛之谦-演员.mp3"), songName: "演员", singer: "薛之谦", duration: "4:21" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  }

})