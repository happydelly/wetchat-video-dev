const app = getApp()

Page({
    data: {
      // songList: [
      //   { src: "http://www.itzixi.com:88/download/timian.mp3", songName: "体面", singer: "于文文", duration: "4:43" },
      //   { src: encodeURI("http://www.itzixi.com:88/download/林俊杰-江南.mp3"), songName: "江南", singer: "林俊杰", duration: "4:23" },
      //   { src: encodeURI("http://www.itzixi.com:88/download/薛之谦-演员.mp3"), songName: "演员", singer: "薛之谦", duration: "4:21" }
      // ]
      songList:[],
      videoParams: {}
    },

    onLoad: function (params) {
      var me = this;
      
      me.setData({
        videoParams:params
      })
      var serverUrl = app.serverUrl;

      wx.showLoading({
        title: '请等待...',
      });
      // 调用后端
      wx.request({
        url: serverUrl + '/bgm/list',
        method: "POST",
        header: {
          'content-type': 'application/json', // 默认值
          'headerUserId': user.id,
          'headerUserToken': user.userToken
        },
        success: function (res) {
          console.log(res.data);
          wx.hideLoading();
          if (res.data.status == 200) {
            var bgmList =  res.data.data;
            me.setData({
              songList: bgmList,
              serverUrl :serverUrl
            })

          } else if (res.data.status == 502) {
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
              icon: "none",
              success: function () {
                wx.redirectTo({
                  url: '../userLogin/login',
                })
              }
            })
          }
        }
      })
    },
    upload : function(e){
      var me = this;
      var bgmId = e.detail.value.bgmId;
      var desc = e.detail.value.desc;
      console.log(me.data.videoParams);

      var duration = me.data.videoParams.duration;
      var tempHeight = me.data.videoParams.tempHeight;
      var tempWidth = me.data.videoParams.tempWidth;
      var tempVideoUrl = me.data.videoParams.tempVideoUrl;
      var tempCoverUrl = me.data.videoParams.tempCoverUrl; 

      var serverUrl = app.serverUrl;
      var userInfo = app.getGlobalUserInfo();
      
      if(userInfo == null || userInfo =="" || userInfo == undefined){
        wx.navigateTo({
          url: '../userLogin/login',
        })
      }

      wx.showLoading({
        title: '上传中...',
      });

      wx.uploadFile({
        url: serverUrl + '/video/upload',
        formData:{
          userId : userInfo.id, //fixme 原來的app.userInfo.id
          bgmId : bgmId,
          desc : desc,
          videoSeconds : duration,
          videoWidth : tempHeight,
          videoHeight : tempWidth
        },
        filePath: tempVideoUrl,
        name: 'file',
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          var data = JSON.parse(res.data)
          console.log(data)
          wx.hideLoading();
          if (data.status == 200) {

            wx.showToast({
              title: '上传成功',
              icon: 'success'
            })

            wx.navigateBack({
              delta: 1
            })

            // var videoId = data.data;
            // debugger;
            // wx.showLoading({
            //   title: '上传中...',
            // });
            // wx.uploadFile({
            //   url: serverUrl + '/video/uploadCover',
            //   formData: {
            //     userId: app.userInfo.id,
            //     videoId: videoId
            //   },
            //   filePath: tempCoverUrl,
            //   name: 'file',
            //   header: {
            //     'content-type': 'application/json'
            //   },
            //   success(res) {
            //     var data = JSON.parse(res.data)
            //     wx.hideLoading();
            //     if (data.status == 200) {
            //       wx.showToast({
            //         title: '上传成功',
            //         icon: "success"
            //       });
            //       wx.navigateBack({
            //         delta: 1
            //       })
            //     } else {
            //       wx.showToast({
            //         title: '上传失败',
            //         icon: 'success'
            //       })
            //     }

            //   }
            // })
            
          }else{
            wx.showToast({
              title: '上传失败',
              icon: 'success'
            })
          }

        }
      })
    }
})

