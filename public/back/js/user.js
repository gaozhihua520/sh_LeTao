// 功能：用户管理
// 从后台获取数据，渲染到页面中，

$(function(){

  // 声明变量，记录当前页
  var currentPage = 1; //记录当前页
  var pageSize = 5;  //表示每页渲染5条数据

  // 2.3 在全局声明变量，用来存储当前用户的id,
  var currentId;
  var isDelete;

  // 刚进入页面的时候就渲染一次
  render();

  // 1.进入页面发送ajax请求，动态渲染页面
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

//  2，点击禁用按钮弹出模态框
//  通过事件委托的形式来注册点击事件，将事件注册给父元素，由子元素触发
  $('tbody').on("click",".btn",function(){
    // 2.1 当点击禁用按钮的时候，模态框出现
    $("#userModal").modal("show");
    
    // 2.2 虎丘当前用户的id，点击禁用启用按钮时模态框隐藏，并且修改当前用户 状态
     currentId = $(this).parent().data("id");
    //  修改用户状态,判断当前用户是否拥有btn-danger类名，是否处于禁用状态，是禁用转态并点击之后修改状态，是禁用就传0，不是则传1
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;

    // console.log(currentId,isDelete);

  });

  // 3. 点击确定修改状态之后，模态框隐藏，并且修改用户的状态，重新渲染页面，发送ajax请求
  $("#userBtn").on("click",function(){
    // console.log(currentId,isDelete);

    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function(info){
        console.log(info);
        // 当请求发送成功时，
        if(info.success){
          // 模态框隐藏
          $("#userModal").modal("hide");
        }

        // 修改当前用户的状态，重新渲染页面
        render();
      }
      
    })



  })

})