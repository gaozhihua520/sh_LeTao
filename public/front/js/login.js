$(function(){

  // 登录验证
      // 1.给登录按钮注册点击事件
      // 2.获取用户输入 的用户名和用户的密码
      // 3.发送请求，进行登录，
              // 1)登录成功，如果直接访问的是登录页就直接跳转到个人中心
              // 2)如果是商品详情页面拦截过来的，就直接跳回详情页
        // 4 如果登录失败，提示用户登录名或者密码错误

  // 1.注册点击事件
  $('#lt_login').click(function(){
    // 2.获取用户名和密码
    var username = $(".lt_main .mui-input-clear").val();
    var password = $(".lt_main .mui-input-password").val();
    // 2.1 判断当前用户有没有输入用户名
    if( username.trim() === "" ){
      mui.toast("请输入用户名");
      return;
    }
    // 2.2 判断当前用户有没有输入密码
    if( password.trim() === "" ){
      mui.toast("请输入密码");
      return;
    }

    // 3.根据获取到的信息，发请求进行登录
    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      dataType: "",
      success: function(info){
        console.log(info);
        //3.1 判断用户是否完整输入用户名和密码
        if( info.error === 403){
          mui.toast("用户名或密码错误");
          return;
        }

        // 3.2 如果登录成功，判断用户是从哪个页面发送请求的
              // 1)有参数，说明从详情页跳过来的，获取地址，登录成功再跳回去
              // 2)没有参数，直接跳转到个人中心
        if( location.search.indexOf("retUrl") != -1 ){
          // 有参数，要调回去
          location.href = location.search.replace("?retUrl=","");
        }else{
          // 没有参数，直接到个人中心
          location.href = "user.html";
        }
      }
    })
  })
})