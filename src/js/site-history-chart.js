var SiteHistoryChart = {
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
	start: function(data, options){
		google.charts.setOnLoadCallback(() => {
      		this.draw(data, options);
      	});

      	$(window).resize(() => {
			this.draw(data, options);
      	});
	},
	draw: function(data, options){
		if( !this.instance ){
			this.instance = new google.visualization.LineChart(document.getElementById(this.elementID));
		}

		var chartData = this.getData(data);
		var chartOptions = Object.assign({
			chartArea: { top:10, width: '80%', height: '80%'},
			legend: { position: 'bottom'},
			fontSize: 14,
			fontName: 'Noto Sans TC',
		}, options || {});

		this.instance.draw(chartData, chartOptions);
	},
	clear: function(){
		if( this.instance ){ this.instance.clearChart(); }
	},
	getData: function(data){
		var dataTable = new google.visualization.DataTable();
		dataTable.addColumn('datetime', 'Time');
		dataTable.addRows(data.labels.length);

		data.datasets.map( (line, index) => {
			dataTable.addColumn('number', line.label);
			for(var i in line.data){
				var value = line.data[i];
				var time = moment(data.labels[i], 'MM-DD HH:mm').toDate();
				dataTable.setCell(+i, 0, time);		
				dataTable.setCell(+i, (index+1), value);
			}
		})
		return dataTable;
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