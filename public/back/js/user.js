// 功能：用户管理
// 从后台获取数据，渲染到页面中，

$(function(){

  // 声明变量，记录当前页
  var currentPage = 1; //记录当前页
  var pageSize = 5;  //表示每页渲染5条数据

  // 刚进入页面的时候就渲染一次
  render();

 function render(){
    //1 向后台获取数据
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      dataType: "json",
      data: {
        page: currentPage,  //页码
        pageSize: pageSize  //每页条数
      },
      success: function(info){
        console.log(info);

        //1.1  绑定模板
        var str = template("tmp",info);
        console.log(str);
        // 根据模板渲染页面
        $('tbody').html(str);

        // 2 分页功能
         // 分页初始化测试
         $('#paginator').bootstrapPaginator({
          // 指定 bootstrap 的版本
          bootstrapMajorVersion: 3,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),
          // 当前页
          currentPage: info.page,
          // 给分页按钮添加点击事件，a,b,c,是三个参数，必须占位，不能删
          onPageClicked: function( a, b, c, page ) {
            console.log( page );
            // 更新当前页
            currentPage = page;
            // 重新渲染页面 render
            render();
          }
        });

      }
    })
 }
})