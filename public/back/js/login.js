$(function(){
    // 1. 进行表单校验
  //    校验要求: (1) 用户名不能为空 2~6
  //              (2) 密码不能为空, 且必须是 6-12 位

  $("#form")
    .bootstrapValidator({

      //4 图标的配置
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
    
      // 1.配置的校验字段
      fields: {
        // 2.用户名校验
        username: {
          //2.1 配置校验规则
          validators: {
            // 2.2 非空校验
            notEmpty: {
              message: "用户名不能为空"
            },
            // 2.3 长度要求，2~6
            stringLength: {
              min: 2,
              max: 6,
              message: "用户名长度必须是 2-6 位"
            },
            callback: {
              message: "用户名不存在"
            }
          }
        },
        // 3.密码验证
        password: {
          //3.1  校验规则
          validators: {
            // 3.2 非空校验
            notEmpty: {
              message: "密码不能为空"
            },
            // 3.3 长度要求，6~12
            stringLength: {
              min: 6,
              max: 12,
              message: "密码的长度必须是6-12位"
            },
            callback: {
              message: "密码错误"
            }
          }
        }
      }
    });

    // 2  当表单校验成功时，会触发success.form.bv事件，此时会提交表单，这时候，通常我们需要禁止表单的自动提交，使用ajax进行表单的提交。
  //  (1) 校验通过的时候，默认将表单继续提交，会跳转页面，需要在校验通过后阻止默认的提交，
  // (2) 校验失败，表单本身就会阻止默认提交

    $("#form").on('success.form.bv', function (e) {
      e.preventDefault();
      //使用ajax提交逻辑

      $.ajax({
        type: "post",
        url: "/employee/employeeLogin",
        // 通过表单序列化的方法快速获取到表单的值
        data: $('#form').serialize(),
        dataType: "json",
        success: function(info){
          console.log(info);
          // 如果登录成功，就跳转页面
          if(info.success){
            location.href = "index.html";
          }

          // // 如果登录失败
          if(info.error === 1000){
            // 说明用户名不存在
            // updateStatus(用户名，校验失败，错误信息)
            $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
            // alert("用户名不存在");
          }
          if(info.error === 1001){
            // 说明密码错误，将表单密码校验状态从成功更新为失败
            // alert("密码错误");
            $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
          }
        }
      })
  });



  // 3 表单重置
  // 属性值为reset的元素，注册点击事件
  $('[type="reset"]').click(function() {
    console.log( 1111 );
    // 除了重置文本, 还要重置校验状态，利用插件的方法
    // resetForm(),传true，表单内容和校验状态都要重置，false，只重置校验状态
    $('#form').data("bootstrapValidator").resetForm();
  });

})