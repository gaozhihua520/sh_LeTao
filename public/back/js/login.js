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
              message: "用户名不存在"
            },
            // 2.3 长度要求，2~6
            stringLength: {
              min: 2,
              max: 6,
              message: "用户名长度必须是 2-6 位"
            },
            callback: {
              message: "用户名不能为空"
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
})