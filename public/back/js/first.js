/**
 * Created by Jepson on 2018/9/29.
 */
$(function() {
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页多少条


  // 1. 一进入页面, 发送ajax请求, 请求一级分类全局数据, 通过模板引擎渲染
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        // 通过 template 方法生成 htmlStr 进行渲染
        var htmlStr = template("addTmp", info);
        $('tbody').html( htmlStr );

        // 分页初始化
        $('#paginator').bootstrapPaginator({
          // 版本号 3
          bootstrapMajorVersion: 3,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),
          // 当前页
          currentPage: info.page,
          // 给页码添加点击事件
          // event 是插件包装过的对象
          // originalEvent 是原始的事件对象
          // type 指代当前点击的页码类型, page普通页码, first, last, next, prev
          // page 指代当前点击按钮对应的页码
          onPageClicked: function(event, originalEvent, type, page) {
            console.log( page );
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    });
  }


  // 2. 点击添加分类按钮, 显示添加模态框
  $('#addBtn').click(function() {
    // 显示添加模态框
    $('#addModal').modal("show");
  });


  // 3. 通过表单校验插件, 实现表单校验功能
  $('#form').bootstrapValidator({
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',      // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置校验字段
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
  });


  // 4. 注册表单校验成功事件, 阻止校验成功时的默认提交, 通过ajax提交
  $('#form').on("success.form.bv", function( e ) {
    // 阻止默认行为
    e.preventDefault();

    // 通过 ajax 提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if(info.success){
          // 关闭模态框
          $('#addModal').modal('hide');
          // 如果用户不是在第一页添加的数据，就得在添加完数据之后，重新渲染第一页
          currentPage = 1;
          render();

          // 当下一次添加页面时，清空上一次添加框内的数据，resetForm()传true是将内容环绕状态全部重置
          $('#form').data("bootstrapValidator").resetForm(true);
        }
      }
    })

  });




});
