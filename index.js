var YAJB = require('yajb-js');

var yajb = new YAJB()
var data = JSON.parse(yajb.data)

// mock data to see how chart works
// var data = [
//   {"time":'2016-08-01',"sum":10.12},
//   {"time":'2016-08-02',"sum":12.12},
//   {"time":'2016-08-03',"sum":20.1},
//   {"time":'2016-08-04',"sum":10.3},
//   {"time":'2016-08-05',"sum":2.2},
//   {"time":'2016-08-06',"sum":0.1},
//   {"time":'2016-08-07',"sum":10.11},
// ]

GM.Global.pixelRatio = 2;
GM.Global.colors = ['#39bfff']
var Util = GM.Util;
var Shape = GM.Shape;
Shape.registShape('point', 'image', {
  	drawShape: function(cfg, canvas){
	    var points = this.parsePoints(cfg.points);
	    var ctx = canvas.getContext('2d');
	    ctx.setLineDash([4,2]); 
	    ctx.lineWidth = 1;
	    ctx.strokeStyle = '#6dd0ff';
	    ctx.beginPath();
	    ctx.moveTo(points[0].x,178);
	    ctx.lineTo(points[0].x,points[0].y + 6);
	    ctx.stroke();
  	}
});
var chart = new GM.Chart({
	id: 'c1'
});
var defs = {
  	time: {
      	type: 'timeCat',
      	mask: 'mm-dd',
      	tickCount: 7,
      	range:[0,1]
  	},
  	tem: {
      	tickCount: 5,
      	min: 0
  	}
};
//配置time刻度文字样式
var label = {
  	fill: '#979797',
  	font: '12px',
  	offset: 6
};
chart.axis('time', {
  	line: {
  	lineWidth: 1, 
  	stroke: '#f5f5f5' 
}, 
label: function (text, index, total) {
  	var cfg = Util.mix({}, label);
    	return cfg;
  	},
  	grid: false,
});
//配置刻度文字大小，供PC端显示用(移动端可以使用默认值20px)
chart.axis('sum', false);
chart.source(data, defs);
chart.line().position('time*sum').shape('smooth').size(2);
chart.point().position('time*sum').size(6).color('#fff');
chart.point().position('time*sum').size(4);
chart.point().position('time*sum').size(2).color('#fff');
chart.point().position('time*sum').shape('image');
data.forEach(function(obj, index) {
  	chart.guide().html([obj.time, obj.sum], `<div style='color: #289bf0;font-size:12px'><span>￥${obj.sum.toFixed(1)}</span></div>`, {
    	align: 'cc',
    	offset: [0,-16],
  	});
});
chart.render();