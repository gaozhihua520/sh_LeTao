$(function(){

  // 0 声明一个变量，存储当前页
  var currentPage = 1;
  var pageSize = 5; //每一页的数据条数

  // 在已进入页面的时候就渲染一次
  render();

  function render(){

    // 1 动态渲染第一页数据
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        pageSize: pageSize,
        page: currentPage
      },
      dataType: "json",
      success: function(info){
        console.log(info);
        // 绑定并渲染模板
        $('tbody').html(template('secondTmp',info));
  
        // 2.分页渲染
        $("#paginator").bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 总页数
          totalPages: Math.ceil(info.total/info.size),
          // 当前页
          currentPage: info.page,
          // 给按钮绑定点击事件
          onPageClicked: function(a,b,c,page) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })
  }

  // 3, 注册添加分类按钮事件
  $("#addBtn").click(function(){
    $("#addModal").modal("show");
    // 4 发送ajax请求，动态渲染一级分类名称,这样用户体验效果好，不会因为网络延迟导致体验效果差
    // 利用分页接口, 模拟获取全部一级分类的接口, 传 page=1, pageSize=100
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info){
        console.log(info);
        // 绑定模板
        $('.dropdown-menu').html(template('dropdownTmp',info));
      }
    })
  });

  // 4 给下拉列表中的一级分类 a 注册点击事件，通过事件委托来注册
  $('.dropdown-menu').on("click","a",function(){
    //4.1 获取当前点击的列表中的a的文本
    var txt = $(this).text();
    // 4.2 将获取到的文本赋值给选择分类的按钮
    $('#dropdownTxt').text(txt);

    // 获取当前a中存储的id
    var id = $(this).data("id");
    // 设置给name="categoryId" 的input
    $('[name="categoryId"]').val(id);

    // 选择了一级分类, 需要将一级分类校验状态, 更新成校验成功状态
    // 参数1: 字段名称
    // 参数2: 校验状态, VALID成功, INVALID失败
    // 参数3: 校验规则, 配置错误时的提示信息
    $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");
  });
  // 5. 文件上传初始化
  /*
   * 文件上传步骤
   * 1. 引包, 注意依赖问题
   * 2. html结构, 给 input:file添加 name 和 data-url 属性
   * 3. 通过 fileupload 方法初始化文件上传插件
   * */
  $("#fileupload").fileupload({
    dataType: "json",
    //5.1 文件上传完成时调用的回调函数
    done: function(e,data){
      // data.result 是后台返回的数据
      console.log(data.result);
      //5.2 获取图片的地址
      var picUrl = data.result.picAddr;
      //5.3 将获取到的地址赋值给img的src
      $("#img_box img").attr("src",picUrl);
      // 5.4 将图片地址设置给name="brandLogo"的input用于提交
      $('[name="brandLogo"]').val(picUrl);

      // 重置校验状态
      $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID");
    }
  });

  // 6 进行表单校验功能初始化
  $("#form").bootstrapValidator({
    // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)']
    // 需要对隐藏域进行校验, 不能排除隐藏域, 将 excluded 置为 [], 表示对所有 input 进行校验
    excluded: [],

    // 指定校验时显示的图标, 固定写法
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',      // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    
    // 配置校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请选择图片"
          }
        }
      }
    }
  });

   // 7. 注册表单校验成功事件, 阻止默认的表单提交, 通过 ajax发送请求
   $('#form').on("success.form.bv", function( e ) {

    // 阻止默认行为
    e.preventDefault();

  //7.1 通过 ajax 提交
  $.ajax({
    type: "post",
    url: "/category/addSecondCategory",
    data: $('#form').serialize(),
    dataType: "json",
    success: function( info ) {
      console.log( info );
      // 请求成功关闭模态框
      if ( info.success ) {
        // 关闭模态框
        $('#addModal').modal("hide");

        // 重新渲染第一页
        currentPage = 1;
        render();

        //7.2 进行表单重置, resetForm传true，表示文本和状态都要重置
        $('#form').data("bootstrapValidator").resetForm(true);

        // 重置只能重置表单元素, 下拉菜单的按钮和图片需要手动重置，当再次点击添加按钮时，上一次提交的数据清空
        $('#dropdownTxt').text("请选择一级分类");
        $('#imgBox img').attr("src", "images/none.png");
      }
    }
  })

})


});