

$(function(){

  // 1,用户信息渲染
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    dataType: "json",
    success: function(info){
      console.log(info);

      // 2.如果当前用户没有登录，跳回登录页
      if( info.error === 400 ){
        location.href = "login.html";
      }else{
        // 2.1 如果登录了，就渲染当前用户数据
        $("#userInfo").html(template("userTmp",info));
      }
    }
  })


  // 2 退出功能
  $('#logout').click(function(){
    $.ajax({
      type: "get",
      url: "/user/logout",
      dataType: "json",
      success: function(info){
        console.log(info);

        // 2.1 如果请求发送成功，就跳转到登录页
        if( info.success ){
          location.href = "login.html";
        }
      }

    })
  })
})