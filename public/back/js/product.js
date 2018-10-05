$(function(){

  // 定义一个变量，存储当前页
  var currentPage = 1;
  var pageSize = 2;  //每一页显示的数据条数

  // 声明变量，维护所有提交的图片
  var picArr = [];

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

    // 4.1 通过发送ajax请求，动态渲染二级分类的下拉列表
  // 通过分页接口模拟,获取全部数据的接口, 传page=1, pageSize=100

    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info){
        console.log(info);
        // 绑定模板
        $(".dropdown-menu").html(template("dropdownTmp",info));
      }
    })
  });

  // 5 给每一个动态渲染出来的a注册委托事件
  $(".dropdown-menu").on("click","a",function(){
    // 5.1 获取当前点击的a的文本，设置给选择二级按钮
    var txt = $(this).text();
    $("#dropdownTxt").text(txt);

    // 5.2 获取当前点击的id 设置给隐藏域
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);

     // 手动将 name="brandId" 的input, 校验状态置成 VALID
    $("#form").data("bootstrapValidator").updateStatus("brandId","VALID");

  });

  // 6 文件上传初始化
    //    多文件上传, 进行多次文件的上传的请求
    //    插件, 会遍历选中的所有的文件, 发送多次文件上传的请求, 将来会有多次响应
    $('#fileupload').fileupload({
      dataType: "json",
      // 文件上传，响应回来时调用的回调函数
      done: function(e,data){
        // data.result 表示后台返回来的结果
        console.log(data.result);
        
      // 将图片对象(名称和地址)存储在数组中, 往前面追加
      picArr.unshift( data.result );

      // 图片地址
      var picUrl = data.result.picAddr;
      // 一旦响应得到图片地址, 就将图片渲染给用户看
      $('#img_box').prepend('<img src="'+ picUrl +'" width="100" height="100" alt="">');

      // 如果数组长度大于 3, 就需要移除最后一张
      // (1) dom 结构中, 移除最后一张图片
      // (2) 数组中, 移除最后一项
      if(picArr.length > 3){
        // 找imgBox中最后一个img类型的元素, 让其自杀
        $("#img_box img:last-of-type").remove();
        // 数组中同时也要移除最后一项
        picArr.pop();
      }

       // 如果数组的长度等于 3, 说明文件上传了 3张, 可以提交
      // 更新表单校验状态 picStatus 为 VALID
      if(picArr.length === 3){
        $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID");
      }

    }
  });

    // 7.利用插件进行表单验证
    $('#form').bootstrapValidator({
      // 对隐藏域也校验
      excluded: [],
      // 指定校验时显示的图标, 固定写法
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',      // 校验成功
        invalid: 'glyphicon glyphicon-remove',   // 校验失败
        validating: 'glyphicon glyphicon-refresh'  // 校验中
      },
  
      // 校验字段
      fields: {
        brandId: {
          validators: {
            notEmpty: {
              message: "请选择二级分类"
            }
          }
        },
        proName: {
          validators: {
            notEmpty: {
              message: "请输入商品名称"
            }
          }
        },
        proDesc: {
          validators: {
            notEmpty: {
              message: "请输入商品描述"
            }
          }
        },
        // 请求库存必须是, 非0开头的数字
        /*
        * 正则, ^ 以...开头, $ 以...结尾
        * [] 内, 表示可以出现的字符
        * [1-9], 表示可以出现 1,2,3,4....9
        * \d 表示 0-9的数字
        *
  
          * 表示 0 个 或 多个
          + 表示 1 个 或 多个
          ? 表示 0 个 或 1个
          {n}   表示出现 n次
          {n,m} 表示出现 n-m 次
  
        * */
        num: {
          validators: {
            notEmpty: {
              message: "请输入商品库存"
            },
            // 正则校验
            regexp: {
              regexp: /^[1-9]\d*$/,
              message: '商品库存必须是非零开头的数字'
            }
          }
        },
  
        // 要求尺码非空, 要求尺码格式 xx-xx,  x为数字
        size: {
          validators: {
            notEmpty: {
              message: "请输入商品库存"
            },
            // 正则校验，尺码格式
            regexp: {
              regexp: /^\d{2}-\d{2}$/,
              message: '要求尺码为 xx-xx 的格式, 例如 32-40'
            }
          }
        },
        price: {
          validators: {
            notEmpty: {
              message: "请输入商品现价"
            }
          }
        },
        oldPrice: {
          validators: {
            notEmpty: {
              message: "请输入商品原价"
            }
          }
        },
  
        // 用于标记当前图片是否上传满三张图片
        picStatus: {
          validators: {
            notEmpty: {
              message: "请上传三张图片"
            }
          }
        }
      }
    });
  

    // 8 注册表单校验成功，阻止默认的表单提交，通过ajax提交
    $("#form").on("success.form.bv",function(e){
      // 阻止默认行为
      e.preventDefault();

     // $('#form').serialize() 只能获取设置 name的表单元素的值, 里面没有图片信息, 所以需要拼接
    // brandId=&statu=1&键=值&..
    // &picName1=xx&picAddr1=xx
    // &picName2=xx&picAddr2=xx
    // &picName3=xx&picAddr3=xx

      var paramsStr = $('#form').serialize();
      
      paramsStr += "&picName1="+ picArr[0].picName +"&picAddr1=" + picArr[0].picAddr;
      paramsStr += "&picName2="+ picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
      paramsStr += "&picName3="+ picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;

      $.ajax({
        type: "post",
        url: "/product/addProduct",
        data: paramsStr,
        dataType: "json",
        success: function(info){
          console.log(info);

          // 如果请求发送成功就关闭模态框
          if(info.success){
            $("#addModal").modal("hide");
            // 页面重新渲染第一页
            currentPage = 1;
            render();

            // 提交过后方便下次提交，要重置表单,内容和状态都要重置，所以resetForm传true
            $("#form").data("bootstrapValidator").resetForm(true);

            // 下拉框按钮和图片不是表单元素，需要手动重置
            $("#dropdownTxt").text("请选择二级分类");
            // 移除所有图片
            $("#img_box img").remove();
            // 数组中也要同步
            picArr = [];
          }
        }
      })
    })
  
});