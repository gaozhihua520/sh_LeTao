  // 功能1： 实现首页数据分析图
      //  准备一个具有宽高的容器

$(function(){

  // 1 左侧柱状图
   // 基于准备好的dom，初始化echarts实例
   var echarts_1 = echarts.init(document.querySelector('.echarts_1'));

   // 指定图表的配置项和数据
   var option1 = {
    //  大标题，柱状图的解释说明
       title: {
        //  标题文本
           text: '2017年注册人数',
          //  标题字体样式
           textStyle: {
             color: "red",
           }
       },
      //  鼠标移入柱状图的时候出现的提示文本
       tooltip: {},
      //  图例
       legend: {
           data:['人数']
       },
      //  表示X轴
       xAxis: {
           data: ["一月","二月","三月","四月","五月","六月"]
       },
      //  表示Y轴
       yAxis: {},
      //  配置的数据
       series: [{
           name: '人数',
           // type 表示图标的类型, bar柱状图, line 折线图, pie 饼图
           type: 'bar',
           data: [1005, 1120, 1536, 2410, 1500, 2000]
       }]
   };

   // 使用刚指定的配置项和数据显示图表。
   echarts_1.setOption(option1);



  //  2 右侧饼状图
     // 基于准备好的dom，初始化echarts实例
     var echarts_2 = echarts.init(document.querySelector('.echarts_2'));

     // 指定图表的配置项和数据
     var option2 = {
        //  大标题，柱状图的解释说明
        title: {
          //  标题文本
            text: '热门品牌销售',
              // 子标题
            subtext: '2017年6月',
            // 控制水平对齐方式
            x:'center'
         },
        //  鼠标移入柱状图的时候出现的提示文本
         tooltip: {
          trigger: 'item',  // 表示鼠标滑到数据项上面时触发
          // 自定义提示框内容
      // {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
          formatter: "{a} <br/>{b} : {c} ({d}%)"
         },
          // 图例
        legend: {
          // 配置图例的显示方式, horizontal 水平排列
          orient: 'vertical',
          // 配置水平对齐方式
          left: 'left',
          data: ['耐克','阿迪','李宁','耐克王','李宁王']
        },
        series: [
          {
          name: '品牌销量',
          //  // type 类型是 饼状图    line/bar
          type: 'pie',
          // 圆的大小
          radius: '50%',
          // 圆心的位置
          center: ['50%','60%'],
          data: [
            {value:335, name:'耐克'},
            {value:310, name:'阿迪'},
            {value:234, name:'李宁'},
            {value:135, name:'耐克王'},
            {value:1548, name:'李宁王'}
          ],
            // 表示额外的阴影等效果
        itemStyle: {
          emphasis: {
            shadowBlur: 50,
            shadowOffsetX: 0,
            shadowColor: 'yellow'
          }
        }
      }
    ]      
  };
  
     // 使用刚指定的配置项和数据显示图表。
     echarts_2.setOption(option2);
  
})