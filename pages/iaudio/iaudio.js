// pages/iaudio/iaudio.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String, 
    songName: String, 
    singer: String, 
    duration: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    mymap3:{},
    isPlaying: false,
    ico: "play"
  },
  ready(){
    var mymap3 = wx.createInnerAudioContext();
    mymap3.src = this.data.src;
    this.setData({
      mymap3: mymap3
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    display(){
      var isPlaying = this.data.isPlaying;
      if(!isPlaying){
        this.data.mymap3.play();
        this.setData({
          isPlaying :true,
          ico: "pause"
        });
      }else{
        this.data.mymap3.pause();
        this.setData({
          isPlaying: false,
          ico: "play"
        });
      }
    }
  }
})
