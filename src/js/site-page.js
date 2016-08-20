require("css/common.css");

var Site;
var siteIdentity = window.location.hash.substr(1);
if(siteIdentity){
	siteIdentity = decodeURIComponent(siteIdentity).split(/-(.+)?/);
	var siteGroup = siteIdentity[0];
	var siteName = siteIdentity[1];

	$("#content").fadeIn();
	$("#no-content").hide();
	$("#siteGroup").text('[' + siteGroup + ']');
	$("#siteName").text(siteName);
	
	findSite(siteGroup, siteName, function(site){
		Site = site;
		initGarge();
		initChartControl();
		initDetailTable();
	});
}

function findSite(siteGroup, siteName, cb){
	var DataSource = require("js/datasource-loader");
	DataSource.boot();
	DataSource.autoUpdate(false);

	var SiteModel = require("js/site-model");
	$("body").on("dataSourceLoadCompelete", function(e, source, data){
		for(var i in data){
			var siteData = data[i];
			if( data[i]['SiteGroup'] == siteGroup && data[i]['SiteName'] == siteName){
				cb(new SiteModel(data[i]));
				break;
			}
		}
	});
}

function initGarge(){
	var GaugeChart = require("js/site-gauge-chart");

	var pm25 = {
		element: "#gauge-pm25",
		size: 'L',
		title: 'PM 2.5',
		measureType: 'PM2.5',
		site: Site,
		fontStyle: {
			color: '#555',
			fontSize: '20',
		}
	};
	GaugeChart.init(pm25);

	var temp = {
		element: "#gauge-temp",
		size: 'L',
		title: 'Temp',
		measureType: 'Temperature',
		site: Site,
		fontStyle: {
			color: '#555',
		}
	};
	GaugeChart.init(temp);

	var humi = {
		element: "#gauge-humi",
		size: 'L',
		title: 'RH',
		measureType: 'Humidity',
		site: Site,
		fontStyle: {
			color: '#555',
		}
	};
	GaugeChart.init(humi);
}

function initChartControl(){
	var SiteHistoryChart = require("js/site-history-chart");

	$("#chart-control .btn[data-range]").click(function(){
		$(this).siblings().removeClass('active').end()
			   .addClass('active');

		$("#history-chart .loading").show();

		var range = $(this).data('range');			
		var resource = Site.getResource();
		var method = 'get' + range + 'Data';
		if( resource && resource[method] ){
			SiteHistoryChart.clear();
			$("#history-chart .loading").show();
			
			var deffered = resource[method]();
			deffered.then(function(data){
				var chartData = resource.getChartData(data.feeds);
				SiteHistoryChart.start(chartData);

				$("#history-chart .loading").hide();
			})
			.catch(function(jqXHR){
				// console.log('error'); console.dir(jqXHR);

				var errorText = 'Load History Error: ' + jqXHR.status + ' ' + jqXHR.statusText;
				$(".history-loading-error").text(errorText).show();
				$("#history-chart").hide();
				$("#history-chart .loading").hide();
			});
		}
	}).filter(":first").click();
}

function genTable(title, data){
	var tbody = '';
	for(var key in data){
		tbody += '<tr><th>' + key + '</th><td>' + data[key] + '</td></tr>';
	}

	return [
		'<div class="col-sm-12 col-md-4">',
		'<h3>' + title + '</h3>',
		'<table class="table table-striped"><tbody>',
		tbody,
		'</tbody></table>',
		'</div>'
	].join('');
}

function initDetailTable(){
	var $detail = $("#detail");
	var obj = {
		SiteGroup: Site.getProperty('SiteGroup'),
		SiteName: Site.getProperty('SiteName'),
		Marker: Site.getProperty('Marker'),
		Lat: Site.getProperty('LatLng')['lat'],
		Lng: Site.getProperty('LatLng')['lng'],
	};

	$detail.append( genTable('Detail', obj) );
	$detail.append( genTable('Data', Site.getProperty('Data')) );
	$detail.append( genTable('Raw Data', Site.getProperty('RawData')) );
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-55384149-4', 'auto');
ga('send', 'pageview');