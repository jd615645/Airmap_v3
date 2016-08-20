var Chart = require("chart.js");

var SiteHistoryChart = {
	booted: false,
	ctx: null,
	instance: null,
	elementID: "site-history-chart",
	lineColors: ['#F4A460', '#FF1493', '#20B2AA', '#ADFF2F', '#B0C4DE'],
	options: {
		animation: false,
		scales: {
			xAxes: [{
				type: "time",
				gridLines: {
					display: false
				},
				time: {
					parser: 'MM-DD HH:mm',
					displayFormats: {
						'minute': 'HH:mm',
						'hour': 'DD HH',
						'day': 'DD',
						'week': 'DD',
						'month': 'MM',
					}
				},
				ticks: {
					padding: 0,
				}
			}],
			yAxes: [{
				gridLines: {
					color: 'rgba(105,105,105,0.3)',
					zeroLineColor: 'rgba(105,105,105,0.3)',
				},
			}],
		},	
	},
	boot: function(){
		if( this.booted ){ return ; }

		this.chartGlobalOption();

		this.ctx = document.getElementById(this.elementID).getContext("2d");             

		this.booted = true;
	},
	chartGlobalOption: function(){
		Chart.defaults.global.defaultColor = 'rgba(105,105,105,0.1)',
		Chart.defaults.global.defaultFontColor = '#8E9090';
		Chart.defaults.global.defaultFontSize = 10;

		Chart.defaults.global.tooltips.mode = 'label';
		Chart.defaults.global.tooltips.backgroundColor = 'rgba(33,33,33,0.8)';
		Chart.defaults.global.tooltips.titleFontSize = 14;
		Chart.defaults.global.tooltips.bodyFontSize = 14;
		Chart.defaults.global.tooltips.bodySpacing = 4;
		Chart.defaults.global.tooltips.xPadding = 8;
		Chart.defaults.global.tooltips.yPadding = 8;

		Chart.defaults.global.legend.position = 'bottom';
		Chart.defaults.global.elements.line.fill = false;
		Chart.defaults.global.elements.line.tension = 0;
		Chart.defaults.global.elements.point.radius = 0;
		Chart.defaults.global.elements.point.hitRadius = 5;
	},
	start: function(data, options){		
		this.boot();
		this.clear();
		
		// line random color
		var colors = this.lineColors.slice();
		for(var i in data.datasets){
			data.datasets[i]['borderColor'] = colors.shift();
		}

		this.instance = new Chart(this.ctx, {
			type: 'line',
			data: data,
			options: $.extend(this.options, options)
		});
	},
	clear: function(){
		if( this.instance ){ this.instance.destroy(); }
	},
	getRandColor: function(brightness){
		// source: http://stackoverflow.com/a/7352887
		//6 levels of brightness from 0 to 5, 0 being the darkest
		var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
		var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
		var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0)})
		return "rgb(" + mixedrgb.join(",") + ")";
	}
};

module.exports = SiteHistoryChart;