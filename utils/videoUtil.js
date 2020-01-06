// var videoUtil = require('../../utils/videoUtil.js')

function uploadVideo() {
  var me = this;
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 10,
    camera: 'back',
    success: function(res) {
      var duration = res.duration;
      var tempHeight = res.height;
      var tempWidth = res.width;
      var tempVideoUrl = res.tempFilePath;
      var tempCoverUrl = res.thumbTempFilePath;

      if (duration > 11) {
        wx.showToast({
          title: '视频长度不能超过10秒',
          icon: "none",
          duration: 2500
        })
      } else if (duration < 1) {
        wx.showToast({
          title: '视频长度太短..',
        })
      } else {
        //打开选择bgm
        wx.navigateTo({
          url: '../chooseBgm/chooseBgm?duration=' + duration +
            '&tempHeight=' + tempHeight +
            '&tempWidth=' + tempWidth +
            '&tempVideoUrl=' + tempVideoUrl +
            '&tempCoverUrl=' + tempCoverUrl
        })
      }
    }
  })
}

module.exports = {
  uploadVideo: uploadVideo
}