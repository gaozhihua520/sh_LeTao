// 功能： 登录拦截功能，
        // 1. 如果当前用户没登录，需要拦截到登录页
  // 通过向后台获取数据，判断当前用户是否处于登录状态
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function(info){
      console.log(info);
      // 说明当前用户没有登录，跳转到登录页
      if(info.error === 400){
        location.href = "login.html";
      }
      
    }
  })