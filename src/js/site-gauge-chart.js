var echarts = require("echarts");

var GaugeChart = {
	gauges: [],
	options: {
		XL: {
		    series : [
		        {
		            type: 'gauge',
		            z: 3,
		            min: 0,
		            max: 100,
		            splitNumber: 10,
		            radius: '90%',
		            axisLine: {
		                lineStyle: { 
		                    width: 40,
		                    color: [],
    					},
		            },
		            axisTick: {
		                length: 40,
		                lineStyle: {
		                    color: 'auto'
		                }
		            },
		            axisLabel: {
		            	show: true,
		            	textStyle: {
		                    fontWeight: 'bolder',
		                    fontSize: 13,
		                }
		            },
		            splitLine: {   
		                length: 50, 
		                lineStyle: {
		                    color: 'auto'
		                }
		            },
		            pointer: {
		                length: '90%',
		                width:10,
		            },
		            itemStyle: {
		            	normal: {
		            		shadowColor: 'rgba(0, 0, 0, 0.5)',
    						shadowBlur: 2,
    						shadowOffsetY: 3
		            	}
		            },
		            title : {
		            	offsetCenter: ['0%', '70%'],
		                textStyle: {
		                    fontWeight: 'bolder',
		                    fontSize: 30,
		                    fontFamily: 'Noto Sans TC',
		            		color: '#FFF'
		                }
		            },
		            detail : {
		            	offsetCenter: ['0%', '30%'],
		                textStyle: {
		                    fontWeight: 'bolder',
		                    fontSize: 30,
		                    fontFamily: 'Noto Sans TC',
		                    color: '#fff',
		                }
		            },
		            data:[{name: '', value: 0}]
		        },
		    ]
		},
		L: {
		    series : [
		        {
		            type: 'gauge',
		            z: 3,
		            min: 0,
		            max: 100,
		            splitNumber: 10,
		            radius: '90%',
		            axisLine: {
		                lineStyle: { 
		                    width: 25,
		                    color: [],
    					},
		            },
		            axisTick: {
		                length: 25,
		                lineStyle: {
		                    color: 'auto'
		                }
		            },
		            axisLabel: {
		            	show: false,		            	
		            },
		            splitLine: {   
		                length: 30, 
		                lineStyle: {
		                    color: 'auto'
		                }
		            },
		            pointer: {
		                length: '80%',
		                width:8,
		            },
		            itemStyle: {
		            	normal: {
		            		shadowColor: 'rgba(0, 0, 0, 0.5)',
    						shadowBlur: 2,
    						shadowOffsetY: 3
		            	}
		            },
		            title : {
		            	offsetCenter: ['0%', '70%'],
		                textStyle: {
		                    fontWeight: 'bolder',
		                    fontSize: 20,		                    
		            		fontFamily: 'Noto Sans TC',
		            		color: '#FFF'
		                }
		            },
		            detail : {
		            	offsetCenter: ['0%', '30%'],
		                textStyle: {
		                    fontWeight: 'bolder',
		                    fontSize: 20,
		                    fontFamily: 'Noto Sans TC',
		                    color: '#fff',
		                }
		            },
		            data:[{name: '', value: 0}]
		        },
		    ]
		},
		M: {
		    series : [
		        {
		            type: 'gauge',
		            z: 3,
		            min: 0,
		            max: 100,
		            splitNumber: 10,
		            radius: '90%',
		            axisLine: {
		                lineStyle: { 
		                    width: 30,
		                    color: [],
		                }
		            },
		            axisTick: {
		                length: 20,
		                lineStyle: {
		                    color: 'auto'
		                }
		            },
		            axisLabel: {
		            	show: false,
		            },
		            splitLine: {   
		                length: 20, 
		                lineStyle: {
		                    color: 'auto'
		                }
		            },
		            pointer: {
		                length: '90%',
		                width:8,
		            },
		            itemStyle: {
		            	normal: {
		            		shadowColor: 'rgba(0, 0, 0, 0.5)',
    						shadowBlur: 2,
    						shadowOffsetY: 3
		            	}
		            },
		            title : {
		            	offsetCenter: ['0%', '70%'],
		                textStyle: {
		                    fontWeight: 'bolder',
		                    fontSize: 20,
		                    fontFamily: 'Noto Sans TC',                    
		            		color: '#FFF'
		                }
		            },
		            detail : {
		            	offsetCenter: ['0%', '30%'],
		                textStyle: {
		                    fontWeight: 'bolder',
		                    fontSize: 20,
		                    fontFamily: 'Noto Sans TC',
		                    color: '#fff',	
		                }
		            },
		            data:[{name: 'PM 2.5', value: 0}]
		        },
		    ]
		},
		S: {
		    series : [
		        {
		            type: 'gauge',
		            z: 3,
		            min: 0,
		            max: 100,
		            splitNumber: 10,
		            radius: '90%',
		            axisLine: {
		                lineStyle: { 
		                    width: 15,
		                    color: [],
    					},
		            },
		            axisTick: {
		                length: 15,
		                lineStyle: {
		                    color: 'auto'
		                }
		            },
		            axisLabel: {
		            	show: false,
		            },
		            splitLine: {   
		                length: 15, 
		                lineStyle: {
		                    color: 'auto'
		                }
		            },
		            pointer: {
		                length: '60%',
		                width:3,
		            },
		            itemStyle: {
		            	normal: {
		            		shadowColor: 'rgba(0, 0, 0, 0.5)',
    						shadowBlur: 2,
    						shadowOffsetY: 3
		            	}
		            },
		            title : {
		            	offsetCenter: ['0%', '70%'],
		                textStyle: {
		                    fontWeight: 'bolder',
		                    fontSize: 13,
		                    fontFamily: 'Noto Sans TC',	                    
		            		color: '#FFF'
		                }
		            },
		            detail : {
		            	offsetCenter: ['0%', '30%'],
		                textStyle: {
		                    fontWeight: 'bolder',
		                    fontSize: 13,
		                    fontFamily: 'Noto Sans TC',
		                    color: '#fff',
		                }
		            },
		            data:[{name: '', value: 0}]
		        },
		    ]
		}
	},
	init: function(userOptions){
		if( !userOptions['site'] || !userOptions['element'] || !userOptions['measureType'] ){ return false; }
		var gauge = {
			site: userOptions['site'],
			element: userOptions['element'],
			measureType: userOptions['measureType'],
			size: userOptions['size'] || 'XL',
			title: userOptions['title'] || userOptions['measureType'],
			instance: null,
			fontStyle: userOptions['fontStyle'] || {},
			timer: null
		}

		gauge.instance = echarts.init( $(gauge.element)[0] );
		// gauge.timer = setInterval(function(){	//TODO: fetch site data (CORS)
		// 	this.updateValue(gauge);
		// }.bind(this), 5 * 1000);

		this.setGargeAxisColor(gauge.size, gauge.measureType);
		this.setFontStyle(gauge);
		this.updateValue(gauge, true);

		this.gauges.push(gauge);
	},
	setValue: function(gauge, value){
		if(typeof value == "number"){
			this.options[gauge.size]['series'][0]['data'][0] = {name: gauge.title, value: value};			
			gauge.instance.setOption(this.options[gauge.size]);
		}else{
			$(gauge.element).html("<div class='msg'>" + gauge.measureType + ' not valid! </div>')
		}
	},
	updateValue: function(gauge, useCache){
		var value = null;
		if(useCache){
			value = gauge.site.getMeasure(gauge.measureType);
			this.setValue(gauge, value);
		}else{
			//TODO: fetch site data (CORS)
			// gauge.site.getResource().getLastestData(function(data){
			// 	this.setValue(gauge, value);
			// }.bind(this));
		}
	},
	setFontStyle: function(gauge){
		if( gauge.fontStyle.fontSize ){
			this.options[gauge.size]['series'][0]['title']['textStyle']['fontSize'] = +gauge.fontStyle.fontSize;
			this.options[gauge.size]['series'][0]['detail']['textStyle']['fontSize'] = +gauge.fontStyle.fontSize;
		}
		if( gauge.fontStyle.color ){
			this.options[gauge.size]['series'][0]['title']['textStyle']['color'] = gauge.fontStyle.color;
			this.options[gauge.size]['series'][0]['detail']['textStyle']['color'] = gauge.fontStyle.color;
		}
		if( gauge.fontStyle.fontWeight ){
			this.options[gauge.size]['series'][0]['title']['textStyle']['fontWeight'] = gauge.fontStyle.fontWeight;
			this.options[gauge.size]['series'][0]['detail']['textStyle']['fontWeight'] = gauge.fontStyle.fontWeight;
		}
	},
	setGargeAxisColor: function(chartSize, measureType){
		var Indicator = require("js/measure-indicator");
		var levels = Indicator.getLevels(measureType);
		if(!levels){ return; }
		
		var colorLevels = [];
		var maxValue = Object.keys(levels).pop();
		for(var levelValue in levels){
			colorLevels.push([levelValue/maxValue, levels[levelValue]]);
		}

		this.options[chartSize]['series'][0]['max'] = maxValue;
		this.options[chartSize]['series'][0]['axisLine']['lineStyle']['color'] = colorLevels;
	},
	clear: function(){
		this.gauges.map(function(gauge, i){
			clearInterval(gauge.timer);
			delete this.gauges[i];
		}.bind(this))
	},

}

module.exports = GaugeChart;