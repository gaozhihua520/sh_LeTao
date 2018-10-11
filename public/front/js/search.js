$(function(){
  // 功能：
  //      1.历史记录渲染
  //      2.点击清空历史按钮，清空所有历史记录
  //      3.单条删除历史记录
  //      4.添加历史记录功能


  // 功能1：历史记录渲染
    // 要进行搜索历史记录管理, 要进行本地存储操作, 所以我们需要约定一个键名
  // 专门用于历史记录管理, 键名: search_list


  // 下面 3 行代码, 用于在控制台执行, 进行假数据初始化
  // var arr = [ "艾迪", "爱迪王", "耐克", "匡威" ];
  // var jsonStr = JSON.stringify( arr );
  // localStorage.setItem("search_list", jsonStr);

  // 一进入页面就调用一次，渲染一下页面
  render();

  // 1.读取历史记录
  function getHistory(){
    // 得到的是json字符串的格式,没有数据是null，所以设定一个默认值，空数组
    var jsonStr = localStorage.getItem("search_list") || "[]";
    // 将得到的json字符串转成数组
    var arr = JSON.parse(jsonStr);
    return arr;
  }

  // 2.读取历史记录。得到数组，进行页面渲染
  function render(){
    // 读取历史数据
    var arr = getHistory();
    $('.lt_history').html(template("historyTmp",{arr: arr}));
  }


  // 功能2：点击清空历史按钮，清空所有历史记录

  // 1 通过事件委托来实现清空效果
  $('.lt_history').on("click",".icon_empty",function(){
    // 2 点击清空按钮出现确认框
    // mui.toast(1);
    mui.confirm("您确认要清空历史记录吗？","温馨提示",["取消","确认"],function(e){
      console.log(e);
      // 点击取消按钮下标index=0，点击确认按钮下标index=1，
      // 3.判断用户当前点击的是哪一个按钮 点击确认之后，清空历史记录，并且重新渲染页面
      if(e.index === 1){
        localStorage.removeItem("search_list");
        // 重新渲染页面
        render();
      }
    })
  })

  // 功能3：单条删除历史记录
      // (1) 通过事件委托绑定点击事件
      // (2) 取出数组, 从自定义属性中读取下标, 通过下标删除数组中的对应项
      //     arr.splice(从哪开始, 删几个, 添加的项1, 添加的项2, 添加的项3, .... );
      //     arr.splice 会改变原数组
      // (3) 将修改后的数组, 转成jsonStr, 存储到本地
      // (4) 重新渲染
  // 1 通过事件委托注册，给每一 i 添加一个自定义属性，data-index，记录每一个下标
  $(".lt_history").on("click",".icon_delete",function(){
    // 2 获取数组
    var arr = getHistory();
    // 3 获取当前用户点击的那条记录的下标
    var index = $(this).data("index");

    // 4 通过获取到的下标删除对应的数据
    arr.splice(index,1);  //从当前点击的那个下标开始，删除一个
    // 5 arr.splice会改变原数组，所以将修改后的数据转成json字符串，重新存储到本地
    localStorage.setItem("search_list",JSON.stringify(arr));
    // 重新渲染数据
    render();
  });


  // 功能4：添加历史记录功能
  // 1.注册搜索按钮功能
  // 2.获取当前用户输入的关键字
  // 3.将获取到的关键字发送到后台，添加到数组的最前面，渲染到历史记录中

  // 1.给搜索按钮注册点击事件
  $(".search_btn").on("click",function(){
  // 2.获取当前用户输入的关键字
    var key = $("input").val().trim();
    console.log(key);
    // 4 判断用户是否输入关键字，没有输入则提示用户输入
    if(key == ""){
      mui.toast("请输入搜索关键字");
      return;
    }

    // 2.1 获取数组
    var arr = getHistory();

    // 4.1 判断搜索的关键字是否有重复项
    // indexOf 判断数组中元素第一次出现的位置，并把索引返回出来，找不到返回-1
    // 获取当前数组中关键字的下标
    var index = arr.indexOf(key);
    if(index != -1){
      // 如果下标不为-1，说明有重复项，删除之前的（老的）,删除数组中重复的元素，下标，一个
      arr.splice(index,1);
    }
    // 4.2 存储历史记录的数组长度不能超过10,超过了就删除数组最后一条的记录
    if(arr.length >= 10){
      arr.pop();
    }

    // 2.2 将获取到的关键字添加到数组的最前面
    arr.unshift(key);
    // 2.3 将数组转成json字符串，渲染到页面上
    var jsonStr = JSON.stringify(arr);
    // 2.4 将得到的字符串存储到本地
    localStorage.setItem("search_list",jsonStr);
    // 2.5 重新渲染页面
    render();

    // 3 当用户提交请求之后，清空搜索框
    $("input").val("");

    // 搜索完之后，跳转页面
    location.href = "searchList.html?key=" + key;
  })

})