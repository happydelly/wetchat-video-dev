var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({
  data: {
    cover: "cover",
    videoInfo: {},
    videoId: "",
    src: "",
    userLikeVideo: false
  },

  videoCtx: {

  },
  onLoad: function(params) {
    var me = this;
    me.videoCtx = wx.createVideoContext("myVideo", me)
    //获取上一个页面传入的参数
    var videoInfo = JSON.parse(params.videoInfo);

    var height = videoInfo.videoHeight;
    var width = videoInfo.videoWidth;
    var cover = "cover";
    if (width >= height) {
      cover = ""
    }

    me.setData({
      videoId: videoInfo.id,
      src: app.serverUrl + videoInfo.videoPath,
      videoInfo: videoInfo,
      cover: cover
    })
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    var loginUserId = "";
    if (user != null && user != undefined && user != '') {
      loginUserId = user.id;
    }
    wx.request({
      url: serverUrl + '/user/queryPublisher?loginUserId=' + loginUserId + 
      '&videoId=' + videoInfo.id +'&publishUserId=' + videoInfo.userId,
      method: "POST",
      success:function(res){
        var publisher = res.data.data.publisher
        var userLikeVideo = res.data.data.userLikeVideo
        me.setData({
          serverUrl: serverUrl,
          publisher: publisher,
          userLikeVideo: userLikeVideo
        })
      }
      
    })
  },
  onShow: function() {
    var me = this;
    me.videoCtx.play();
  },
  onHide: function() {
    var me = this;
    me.videoCtx.pause();
  },
  showSearch: function() {
    wx.navigateTo({
      url: '../searchVideo/searchVideo',
    })
  },
  upload: function() {
    var me = this;
    var userInfo = app.getGlobalUserInfo();
    var videoInfo = JSON.stringify(me.data.videoInfo);
    var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo

    if (userInfo == null || userInfo == "" || userInfo == undefined) {
      wx.navigateTo({
        url: '../userLogin/login?redirectUrl=' + realUrl,
      })
    } else {
      videoUtil.uploadVideo();
    }

  },
  showIndex: function() {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  showMine: function() {
    var userInfo = app.getGlobalUserInfo();
    if (userInfo == null || userInfo == "" || userInfo == undefined) {
      wx.navigateTo({
        url: '../userLogin/login',
      })
    } else {
      wx.navigateTo({
        url: '../mine/mine',
      })
    }
  },
  likeVideoOrNot: function() {
    var me = this
    var videoInfo = me.data.videoInfo;
    var user = app.getGlobalUserInfo();

    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../userLogin/login',
      })
    } else {
      var userLikeVideo = me.data.userLikeVideo;
      // var url = '/video/userLike?userId=' + user.id + '&videoId=' +videoInfo.id+
      //     '&videoCreaterId=' + videoInfo.userId;
      var url = '/video/userLike'
      if (userLikeVideo) {
        // url = '/video/userUnLike?userId=' + user.id + '&videoId=' + videoInfo.id +
        //   '&videoCreaterId=' + videoInfo.userId;
        url = '/video/userUnLike'
      }
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '...',
      })
      wx.request({
        url: serverUrl + url,
        method: "POST",
        data: {
          userId: user.id,
          videoId: videoInfo.id,
          videoCreaterId: videoInfo.userId
        },
        header: {
          'content-type': 'application/json', // 默认值
          'headerUserId': user.id,
          'headerUserToken': user.userToken
        },
        success: function(res) {
          wx.hideLoading();
          me.setData({
            userLikeVideo: !userLikeVideo
          });
        }
      })
    }

  }
})