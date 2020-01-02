// var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    
  },

  onLoad: function () {
    var me = this;

    var user = app.userInfo;
    var serverUrl = app.serverUrl;

    wx.showLoading({
      title: '请等待...',
    });
    // 调用后端
    wx.request({
      url: serverUrl + '/user/query?userId='+user.id,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 200) {
          var userinfo = res.data.data;
          var faceUrl = "../resource/images/noneface.png";
          if (userinfo.faceImage != null && userinfo.faceImage != '' &&
              userinfo.faceImage != undefined){
             faceUrl = serverUrl + userinfo.faceImage
          }
          
          me.setData({
            faceUrl: faceUrl,
            fansCounts: userinfo.fansCounts,
            followCounts: userinfo.followCounts,
            receiveLikeCounts: userinfo.receiveLikeCounts,
            nickname: userinfo.nickname
          });


        }
      }
    })

  },
  logout: function(){
    var user = app.userInfo;

    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请等待...',
    });
    // 调用后端
    wx.request({
      url: serverUrl + '/logout?userId='+user.id,
      method: "POST",

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 200) {
          // 注销成功跳转 
          wx.showToast({
            title: '注销成功',
            icon: 'success',
            duration: 2000
          });
            app.userInfo = null;
            //TODO 页面跳转
            wx.redirectTo({
              url: '../userLogin/login'
            })
        }
      }
    })
  },
  changeFace: function(e){
    var me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)

        wx.showLoading({
          title: '上传中...',
        })
        var serverUrl = app.serverUrl;
        wx.uploadFile({
          url: serverUrl +'/user/uploadFace?userId='+app.userInfo.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header:{
             'content-type':'application/json'
          },
          success(res) {
            var data = JSON.parse(res.data)
            console.log(data)
            wx.hideLoading();
            if(data.status == 200){
              wx.showToast({
                title: '上传成功',
                icon: "success"
              });

              var imageUrl = data.data;
              me.setData({
                faceUrl:serverUrl+imageUrl
              })
            }else if(data.status == 500){
              wx.showToast({
                title: data.msg
              })
            }
            
          }
        })
      }
    })
  },
  uploadVideo: function(){
    var me = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 10,
      camera: 'back',
      success:function(res) {
        var duration =  res.duration;
        var tempHeight = res.height;
        var tempWidth =  res.width;
        var tempVideoUrl = res.tempFilePath;
        var tempCoverUrl =  res.thumbTempFilePath; 

        if(duration > 11){
          wx.showToast({
            title: '视频长度不能超过10秒',
            icon:"none",
            duration:2500
          })
        }else if(duration < 1){
          wx.showToast({
            title: '视频长度太短..',
          })
        }else {
          //打开选择bgm
          wx.navigateTo({
            url: '../chooseBgm/chooseBgm?duration=' + duration 
              + '&tempHeight=' + tempHeight
              + '&tempWidth=' + tempWidth
              + '&tempVideoUrl=' + tempVideoUrl
              + '&tempCoverUrl=' + tempCoverUrl
          })
        }
      }
    })
  }


})
