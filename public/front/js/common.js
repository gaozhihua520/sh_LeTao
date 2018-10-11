// 区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
  deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  indicators: false //是否显示滚动条
});

// 轮播图初始化
//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
});


// 封装一个获取地址栏信息的函数
function getSearch(keywords){
  //1 获取输入的搜索信息
  var search = location.search;

  // 1.1 将获取到的地址栏信息解析成中文
  search = decodeURI(search);
  // 1.2 将获取到的信息去掉？号从下标为1的位置开始截取
  search = search.slice(1); //得到一个key=1&name=zs&....的类型
  // 1.3 根据&符号来分割字符串
  var arr = search.split("&"); // ["key=1","name=zs"];形式的数组
  // 1.4 遍历循环得到的数组， 以=分割，存到obj对象中
  var obj = {};
  arr.forEach(function(v,i){
    var key = v.split("=")[0]; //得到"键"
    var value = v.split("=")[1]; //得到"值"
    // 将每次循环得到的建和值存到obj中
    obj[key] = value;
  })
  return obj[keywords];
 
}