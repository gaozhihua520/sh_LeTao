// 分类页
// 功能：动态渲染数据，通过发送ajax请求
$(function(){
  // 左侧数据渲染
  // 1.通过ajax向后台发送请求，获取数据
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function(info) {
      console.log(info);
      // 准备模板引擎
      // 绑定模板，并渲染页面
      $(".lt_category_left ul").html(template("categoryTmp",info));

      // 一进入页面就渲染一下一级分类对应的二级分类
      renderHis(info.rows[0].id);
    }
  });

  // 3 通过事件委托给每个a注册点击事件，显示右侧二级分类页
  
  $(".lt_category_left").on("click","a",function(){

    // 给当前点击的分类添加current类名，实现高亮
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
    var id = $(this).data("id");
    renderHis(id);
  })

  // 2 通过发送ajax请求，向后台请求数据，渲染二级分类数据
  function renderHis(id){
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success: function(info){
        console.log(info);
        // 准备模板，并绑定渲染页面
        $(".lt_category_right ul").html(template("rightTmp",info));
      }
    })
  }
 
});