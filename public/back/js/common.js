// 1 需求: 在发送第一个ajax的时候, 开启进度条, 在全部的ajax回来的时候, 结束进度条
$(document).ajaxStart(function() {
  // 开启进度条
  NProgress.start();
});

$(document).ajaxStop(function() {
  // 模拟网络延迟
  setTimeout(function() {
    // 关闭进度条
    NProgress.done();
  }, 500);
});

// 功能2：
      // 1.点击分类管理菜单时，展开二级导航
      // 2.点击菜单icon_menu按钮时，侧边栏隐藏
      // 3.点击退出登录按钮，退出登录，跳转login事件

$(function(){
  // 1. 找到分类管理
  $('.lt_aside .category').click(function(){
    // console.log(111);
    // 1.1 分类导航下的子菜单切换隐藏
    $('.lt_aside .child').stop().slideToggle();
  });

  //2. 注册icon_menu点击隐藏侧边栏事件
  $('.lt_main .icon_menu').click(function(){
    // console.log(1111);
    // 2.1 当点击之后，给主体lt_main,侧边栏和头部header添加hidemenu类，实现侧边栏隐藏
    $('.lt_aside').toggleClass('hidemenu');
    $('.lt_main').toggleClass('hidemenu');
    $('.lt_main .header').toggleClass('hidemenu');

  });

    // 3. 注册icon_logout事件
    $('.lt_main .icon_logout').click(function(){
      // console.log(111111);
      // 只需一行 JavaScript 代码，即可通过元素的 id myModal 调用模态框：$('#myModal').modal(options)
      $('#logoutModal').modal('show');
    })

     // 3.1 退出功能, 应该调用后台提供的接口, 在服务器端销毁该用户的登陆状态
     $('#logoutBtn').click(function(){
       $.ajax({
         type: "get",
         url: "/employee/employeeLogout",
         dataType: "json",
         success: function(info){
            // console.log(info); 
            // 如果发送请求成功，退出首页，回到登录页面
            if(info.success){
              location.href = "login.html";
            }
         }
       })
     }) 
});