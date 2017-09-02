/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var YAJB = __webpack_require__(2);

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	(function (global, factory) {
		 true ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.YAJBJS = factory());
	}(this, (function () { 'use strict';

	var YAJB = function(){
		this.eventQueue = [];
		this.counter = 1;
		var options;
		this.isAndroid = false;
		this.isiOS = false;
		// get global options
		if (window.javaInterface) {
			options = JSON.parse(window.javaInterface.toString());
			this.isAndroid = true;
		}else if (window.YAJB_INJECT){
			options = window.YAJB_INJECT;
			this.isiOS = true;
		}
		else {
			throw new Error('No Global Inject Object detected, please use yajb-js in a YAJB WebView Environment.');
		}
		this.platform = options.platform;
		this.data = options.data;
		window.YAJB_INSTANCE = this; 
	};

	YAJB.prototype.isMobile = function() {
		if (window.javaInterface || window.YAJB_INJECT) {
			return true
		}else {
			return false
		}
	};

	YAJB.prototype._emit = function(option){
		var opt = JSON.parse(option);
		// trigger event
	    //this.messageQueue.push(opt)  
	    this.checkQueue(opt);
		// this.events[option.name].apply({}, option.data)
	};

	YAJB.prototype._send = function(option) {
		if (this.isAndroid) {
			// window.alert(JSON.stringify(option))
			window.location = "hybrid://" + option.event + ':' + option.id + '/'+ option.data;
		}else if (this.isiOS) {
			// window.postMessage
		}
	};

	YAJB.prototype.checkQueue = function(option){
		var event = this.eventQueue.find(function(item){
			return item.id == option.id
		});
		event.callback(option.data);
	};

	// YAJB.prototype.on = function(event, callback) {
	// 	//register event
	//     if(!YAJB.events[event]) {
	//       YAJB.events[event] = [];
	//     }
	//     YAJB.events[event].push(callback);
	// }

	YAJB.prototype.send = function(event, data) {
		var that = this;
		return new Promise(function(resolve, reject){
			that.eventQueue.push({
				event: event + "Resolved",
				id : that.counter,
				callback: function(value){
					console.log("resolve");
					resolve(value);
				}
			});
			that._send({event:event,id:that.counter,data:JSON.stringify(data)});
			that.counter++;
		})
	};

	YAJB.prototype.register = function(event,fn){
		this.eventQueue.push({
			event: event,
			callback: fn
		});
	};


	YAJB.prototype._trigger = function(option){
		var opt = JSON.parse(option);
		var event = this.eventQueue.find(function(item){
			return item.event === opt.event
		});
		var that = this;
		event.id = opt.id;
		event.callback(opt.data,function(result){
			var op = {event: opt.event + 'Resolved',data:result,id:opt.id};
			that._send(op);
		});
	};

	return YAJB;

	})));


/***/ })
/******/ ]);