$(function(){


  // 功能1： 动态渲染商品列表
  // 根据用户输入的关键字，获取地址栏的productId，发送ajax请求，获取数据，进行渲染

  // 1.获取商品列表数据
  var productId = getSearch("productId");

  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId
    },
    dataType: "json",
    success: function(info){
      console.log(info);
      // 2.准备模板，并绑定模板，进行渲染
      $('.lt_main .mui-scroll').html(template("productListTmp",info));
      
    // 轮播图初始化
      var mySwiper = new Swiper ('.swiper-container', {

        loop: true, // 循环模式选项
        
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
        },
        
        // 自动轮播
        autoplay: true,
      
        // 动画效果
        effect: "cube",
      });

      // 初始化数字框
      mui(".mui-numbox").numbox();
    }
  })

  // 功能2：给每一个尺码span注册点击事件
  // 利用事件委托，给最外层的大盒子注册点击事件
  $(".lt_main").on("click",".lt_size span",function(){
    // 1.给用户点击的当前span添加current类，实现高亮效果
    $(this).addClass("current").siblings().removeClass("current");
  })

  // 功能3： 添加购物车功能
                // 1.给购物车注册点击事件
                // 2.获取尺码和数量信息，发送加入购物车请求，后台判断当前用户有没有登录
                          // 1)如果没有登录，就拦截到登录页
                          // 2)如果当前用户登录了，就跳转页面到购物车页面，继续添加购物车操作


  // 1，注册点击事件
  $('#addCart').click(function(){
    // 1.1 获取当前高亮的span，说明是用户选择的尺码
    var size = $('.lt_size span.current').text();
    // 获取当前input框的属性值，判断用户选的数量
    var num = $('.num_box .mui-numbox-input').val();
      console.log(num+"数量");
      console.log(size);

      // 1.2 因为默认选择的数量是1，所以不需要判断用户偶没有选数量，要判断用户有没有选择尺码
      if( !size ){
        mui.toast("请选择尺码");
        return;
      }

      // 2.根据获取到的尺码和数量信息，向后台发送数据，添加到购物车
      $.ajax({
        type: "post",
        url: "/cart/addCart",
        data: {
          productId: productId,
          num: num,
          size: size,
        },
        dataType: "json",
        success: function(info){
          console.log(info);

          

          // 2.1 如果当前用户登录成功，跳转到购物车，进行添加购物功能
          if( info.success ){
            console.log(1111);
            // 2.2 当点击添加购物车之后，出现确认框
            mui.confirm("添加成功","温馨提示"
          ,["去购物车","继续浏览"],function(e){
            console.log(e);
          });
          // 2.3 继续浏览按钮的索引为1，去购车的按钮索引是0，因此，通过索引可以判断当前用户点击的是哪一个按钮，跳到对应的页面
            // 2.4 如果按钮的索引是0，则跳转到购物车
            if( e.index === 0 ){
              location.href = "cart.html";
            }
          }

          // 如果登录失败，则跳转到登录页面
          if( info.error === 400 ){
            // 没登陆, 跳转到登录页, 将来在登陆页登陆, 登录成功需要跳转回来, 需要知道当前页的地址
            // 考虑通过地址栏传参, 将当前页的地址传递给登录页
            location.href = "login.html?retUrl="+location.href;
            return;
            }
        }
      })
  })
})