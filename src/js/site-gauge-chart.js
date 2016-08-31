var GaugeChart = {
	googleLoaded: false,
	gauges: [],
	options: {
		XL: {
		   width: 320,
		    height: 320,
		},
		L: {
		    width: 220,
		    height: 220,
		},
		M: {
		    width: 180,
		    height: 180,
		},
		S: {
		    width: 90,
		    height: 90,
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

		this.gauges.push(gauge);

		if( !this.googleLoaded ){
			// google.charts.load('current', {'packages':['gauge']});
			this.googleLoaded = true;
		}

      	google.charts.setOnLoadCallback(() => {
      		this.draw(gauge);
      	});
	},
	draw: function(gauge){
		var data = this.getData(gauge);
		if( data === false){ return false; }

		var options = Object.assign({}, this.options[gauge.size], this.getColorOptions(gauge));

		gauge.instance = new google.visualization.Gauge($(gauge.element)[0]);
		gauge.instance.draw(data, options);
	},
	getData: function(gauge){
		var value = gauge.site.getMeasure(gauge.measureType);
		if(typeof value == "number"){
			var dataTable = new google.visualization.DataTable();
			dataTable.addColumn('string', 'Label');
		    dataTable.addColumn('number', 'Value');
		    dataTable.addRows([
		    	[gauge.title, value]
		    ]);
			return dataTable;
		}else{
			$(gauge.element).html("<div class='msg'>" + gauge.measureType + ' not valid! </div>');
			return false;
		}		
	},
	getColorOptions: function(gauge){
		if( gauge.measureType == "PM2.5"){
			return {redFrom: 53, redTo: 100, yellowFrom:35, yellowTo: 53, greenFrom:0, greenTo:35};
		}
		if( gauge.measureType == "Temperature"){
			return {redFrom: 30, redTo: 40, yellowFrom:26, yellowTo: 30, greenFrom:0, greenTo:26, max: 40};
		}
		if( gauge.measureType == "Humidity"){
			return {redFrom: 80, redTo: 100, yellowFrom:60, yellowTo: 80, greenFrom:0, greenTo:60};
		}
	},
	clear: function(){
		this.gauges.map(function(gauge, i){
			gauge.instance.clearChart();
			clearInterval(gauge.timer);
			delete this.gauges[i];
		}.bind(this))
	},

}

module.exports = GaugeChart;