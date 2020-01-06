const app = getApp()

Page({
    data: {

    },
    doRegist:function(e){
      var formObject = e.detail.value;
      var username = formObject.username;
      var password =formObject.password;

      if(username.length == 0 || password.length == 0){
        wx.showToast({
          title: '用户名或密码不能为空',
          icon:'none',
          duration:3000
        })
      }else{
        var serverUrl = app.serverUrl;
        wx.showLoading({
          title: '请等待...',
        });
        wx.request({
          url: serverUrl + '/regist',
          method: "POST",
          data:{
            username:username,
            password:password
          },
          header:{
            'content-type': 'application/json' // 默认值
          },
          success:function(res){
            console.log(res.data);
            wx.hideLoading();
            var status = res.data.status;
            if(status == 200){
              wx.showToast({
                title: "注册成功!!",
                icon: 'none',
                duration: 3000
              }),
                //app.userInfo = res.data.data;
                app.setGlobalUserInfo(res.data.data);
                wx.redirectTo({
                  url: '../userLogin/login',
                })
            }else if(status == 500){
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000
              })
            }
          }
        })
      }
    },
    goLoginPage:function(){
      wx.redirectTo({
        url: '../userLogin/login'
      })
    }
    
})