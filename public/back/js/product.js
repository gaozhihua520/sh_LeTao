$(function(){

  // 定义一个变量，存储当前页
  var currentPage = 1;
  var pageSize = 2;  //每一页显示的数据条数

  render(); //一进入页面就渲染一次数据

  function render(){

    //1 通过ajax发送请求，动态渲染数据
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info){
        console.log(info);
        // 绑定模板，动态渲染数据页面
        $('tbody').html(template("productTmp",info));
  
        //2 分页初始化
        $("#paginator").bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 数据总页数
          totalPages: Math.ceil( info.total/info.size ),
          // 当前页
          currentPage: info.page,
          // 给页码添加点击事件
          onPageClicked: function(a,b,c,page){
            // 更新当前页
            currentPage = page;
            // 重新渲染页面
            render();
          },

          //3  控制按钮显示的文字
          // itemTexts 是一个函数, 每个按钮在初始化的时候, 都会调用该函数
          // 将该函数的返回值, 作为按钮的文本
          // type: 按钮的类型, page, first, last, prev, next
          // page: 表示点击按钮跳转的页码
          // current: 当前页
          itemsTexts: function(type,page,current){
            switch(type){
              case "page":
                return page;
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },
           // 每个按钮在初始化的时候, 都会调用一次该函数
          // 将该函数的返回值, 作为按钮的 title 提示文本
          tooltipTitles: function(type, page, current) {
            switch ( type ) {
              case "page":
                return "前往第" + page + "页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },
          // 使用bootstrap 提示组件
          useBootstrapTooltip: true,

        }) 
      }
    })
  }

  //4 注册点击添加商品按钮，显示模态框
  $('#addBtn').click(function(){
    // 显示模态框
    $("#addModal").modal("show");
  })
})