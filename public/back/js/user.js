// 功能：用户管理
// 从后台获取数据，渲染到页面中，

$(function(){
  //向后台获取数据
  $.ajax({
    type: "get",
    url: "/user/queryUser",
    dataType: "json",
    data: {
      page: 1,
      pageSize: 5
    },
    success: function(info){
      console.log(info);
    }
  })
})