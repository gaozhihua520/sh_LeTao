$(function(){

  // 5 清空原有数据，刚进入页面的时候，就出现加载的图片，用户体验效果好
  $('.lt_product').html('<div class="loading"></div>')

  // 功能1：
  // 1 获取地址栏信息，解析地址栏信息
  var key = getSearch("key");
  $('input').val(key);

  // 一进入页面根据用户输入的关键字，渲染页面
  render();


  // 1.获取input的值，请求数据，进行渲染
  function render(){
    // 1.2 三个必传的参数
    var params = {};
    params.proName = $('input').val(); //搜索关键字
    params.page = 1;
    params.pageSize = 100;

    //3 两个可选参数，通过判断有没有高亮的a标签，来决定需不需要传递排序的参数
    //3.1 $current 接收当前所有高亮的a
    var $current = $(".lt_sort a.current");
    //3.2 如果存储有高亮的a 的$current 的长度大于0，说明有高亮的a
    if($current.length > 0){
      // 当前a 标签有current类，需要进行排序
      console.log("需要进行排序");
      //3.3 获取传给后台的键，高亮a上面的类名属性
      var sortName = $current.data("type");
      //3.4 获取高亮a里面的i标签上的类名，来判断具体升序还是降序，通过判断箭头的方向决定，（1，升序，2 降序）
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;

      //3.5 将获取到的键和值拼接到params中，（拼接字符串）
      params[sortName] = sortValue;
    }

    // 1.1 通过ajax发送请求，获取搜索到商品，通过模板引擎渲染
    setTimeout(function(){
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function(info){
          console.log(info);
          // 准备模板引擎，并绑定渲染模板
          $(".lt_product").html(template("tmp",info));
        }
      })
    },1000);

  }

  // 2.给搜索按钮注册点击事件，获取关键字，发送请求，重新渲染页面

  $(".search_btn").click(function(){
    console.log(111);
    render();
  });


  // 4. 给价格和库存注册 点击事件
          // 1.通过a[data-type]来绑定
          // 2.切换current类
                  // 1).点击a标签没有current类，直接加上current类，并且移除其他a的current类
                  // 2).点击a 有current的就切换箭头的方向
          // 3.重新渲染页面
  // 4.1 找到下面所有拥有data-type属性的a，并注册点击事件
  $('.lt_sort a[data-type]').click(function(){
    //4.2 当前点击的a标签没有current类，直接加上current类，并且移除其他a的current类
    if($(this).hasClass("current")){
      //4.3 有这个类，切换箭头的方向,当前点击的标签下的i
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");

    }else{
      //4.4 没有这个类,给当前标签添加current类，并移出其他a的current类
      $(this).addClass("current").siblings().removeClass("current");
    }
    //4.5 重新渲染页面
    render();
  })
})