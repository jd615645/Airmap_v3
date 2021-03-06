require("bootstrap-slider/dist/css/bootstrap-slider.min.css");
require("css/compoment-navigator.css");

var Vue = require("vue");
var Indicator = require("js/measure-indicator");

require("js/vue-animation");
require("js/navigator-switch-handler");

/**
 * Vue compoment
 */
var Navigator = new Vue({
	el: '#navigator',
	data: {
		open: false,
		activeItem: 'siteLayer',
		site: {
			category: [],
			measure: [],
			voronoiLayerOpacity: 5,
			detailPageHref: '#',
			siteDatasource: '#',
			lastUpdate: null,
			chartTitle: '',
			chartDatasource: '#',
			chartInterval: 'Hourly',
			chartLoading: false,
			chartLoadingError: false,
			instance: null,
		},
		wind: {
			loading: false, 
			lineOpacity: 6,
			movingSpeed: 1,
			dateUpdateTime: '',
		},
		emission_opacity: 10,
		satellite_opacity: 5,
	},
	methods: {
		toggleContainer: function(e){
			this.open = !this.open;
		},
		showItemText: function(itemName){
			return itemName == this.activeItem;
		},
		changeActiveItem: function(e){
			var isTextNode = $(e.target).is(".list-group-item-heading > span");
			var isSelf = $(e.target).is(".list-group-item-heading");
			if( !isSelf && !isTextNode ){ return false; }

			var $el = $(e.target).parents(".list-group-item");
			var name = $el.data("name");

			this.activeItem = this.activeItem == name ? '' : name;
		},
		site_changeCategory: function(e){
			var name = $(e.target).data('category');
			this.site.category.map(function(site, i){
				if( site.name == name ){
					site.active = !site.active;
				}
			});

			var actives = [];
			this.site.category.map(function(site, i){
				if(site.active){ actives.push(site.name); }
			});
			$("body").trigger("site_changeCategory", [actives]);
		},
		site_selectAllCategory: function(){
			var actives = [];
			this.site.category.map(function(site, i){
				site.active = true;
				actives.push(site.name);
			});
			$("body").trigger("site_changeCategory", [actives]);
		},
		site_deselectAllCategory: function(){
			var actives = [];
			this.site.category.map(function(site, i){
				site.active = false;
			});
			$("body").trigger("site_changeCategory", [actives]);
		},
		site_changeMeasure: function(e){
			var name = $(e.target).text().trim();
			this.site.measure.map(function(site, i){
				site.active = (site.name == name);
			});

			Indicator.changeType(name);
		},		
		site_chartIntervalActive: function(interval){
			return interval == this.site.chartInterval;
		},
		changeChartInterval: function(interval){
			this.site.chartInterval = interval;
			loadSiteHistoryChart();
		},
		areaQuickNavi: function(e){
			var area = e.target.dataset.area;
			var areaInfo = {
				'taipei': {
					center: MapHandler.createLatLng(25.051870291680714, 121.5127382838134),
					zoom: 13,
				},
				'taichung': {
					center: MapHandler.createLatLng(24.15600810053703, 120.6664476954345),
					zoom: 13,
				},
				'chiayi': {
					center: MapHandler.createLatLng(23.480461635135327, 120.44427495831292),
					zoom: 14,
				},
				'kaohsiung': {
					center: MapHandler.createLatLng(22.635652591485744, 120.30467134350579),
					zoom: 13,
				},
			};
			var map = MapHandler.getInstance();
			map.setCenter( areaInfo[area].center );
			map.setZoom( areaInfo[area].zoom );
		}
	},
	computed: {
		wind_movingSpeedText: function(){
			if( this.wind.movingSpeed == 1 ){ return '1x'; }
			return '1/' + this.wind.movingSpeed + 'x';
		}
	},
	watch: {
		'open': function(newValue){
			var left = newValue ? 0 : -1 * $(this.$el).width();
			$(this.$el).animate({ left: left }, 300);
		},
		'site.voronoiLayerOpacity': function(newValue){
			$("#siteVoronoi").find("svg").css("opacity", newValue/10);
		},
		'wind.lineOpacity': function(newValue){
			$("body").trigger("wind_lineOpacity", newValue/10);
		},
		'wind.movingSpeed': function(newValue){
			$("body").trigger("wind_movingSpeed", newValue);
		},
		'emission_opacity': function(newValue){
			$("#emissionVoronoi").css('opacity', newValue/10);
		},
		'satellite_opacity': function(newValue){
			$("#satelliteLayer").css('opacity', newValue/10);
		},

	}
});

//watch isOpen to trigger animation open/close navigator
var $el = $(Navigator.$el);
$el.css('left', Navigator.open ? 0 : -$el.width() );


/**
 * Events
 */
var $body = $("body");


$body.on('openNavigator', function(e, activeItem){
	Navigator.open = true;
	if(activeItem){ Navigator.activeItem = activeItem; }
});

//load site group
$body.on("sitesLoaded", function(e, groups){
	var category = Navigator.site.category;
	var existsNames = Navigator.site.category.map(function(cat){ return cat.name; });
	
	for(var name in groups){
		var cnt = groups[name];

		if(existsNames.indexOf(name) < 0){
			category.push({name: name, cnt: cnt, active: true});
		}

	};
	Navigator.site.category = category;
});

//load measure type
var types = Indicator.getTypes();
var activeType = Indicator.getPresentType();
var measures = [];
types.map(function(type){
	measures.push({name: type, active: activeType == type});
})
Navigator.site.measure = measures;

//click outside to close navigator
$body.click(function(e){
	var isChildrenOfNavigator = $.contains(Navigator.$el, e.target);
	if( !isChildrenOfNavigator && Navigator.open ){
		Navigator.open = false;
	}
});

//wind layer
$body.on("wind_lineOpacity", function(e, value){
	value = value*10;
	if( value == Navigator.wind.lineOpacity){ return; }
	Navigator.wind.lineOpacity = value;
	$(".wind-lineOpacity").slider().slider('setValue', value);
});
$body.on("wind_movingSpeed", function(e, value){
	if( value == Navigator.wind.movingSpeed){ return; }
	Navigator.wind.movingSpeed = value;
	$(".wind-movingSpeed").slider().slider('setValue', value);
});
$body.on("wind_loading", function(e, state){
	Navigator.wind.loading = !!state; 
});
$body.on("wind_changeUpdateString", function(e, text){
	Navigator.wind.dateUpdateTime = text;
});

//info window
var loadSiteHistoryChart = function(){
	var Site = Navigator.site.instance;
	var resource = Site.getResource();
	var method = 'get' + Navigator.site.chartInterval + 'Data';

	if( resource && resource[method] ){
		var SiteHistoryChart = require("js/site-history-chart");
		Navigator.site.chartLoading = true;
		
		var deffered = resource[method]();
		deffered.then(function(data){			
			var chartData = resource.getChartData(data.feeds);
			SiteHistoryChart.start(chartData);

			Navigator.site.chartDatasource = data.url;
			Navigator.site.chartLoadingError = false;
			Navigator.site.chartLoading = false;
		})
		.catch(function(err){
			// console.log('err'); console.dir(err);
			var error = '';
			if( typeof err === 'object' ){	//object
				if(err.message){ error = err.message; }	//exception
				if(err.statusText){ error = 'ajax request error msg is ' + err.statusText; }	//jqXHR
			}
			if( typeof err === 'string' ){
				error = err;
			}

			var errorText = 'Load History Error: ' + error;

			Navigator.site.chartLoadingError = errorText;
			Navigator.site.chartLoading = false;
		});
	}
}
$body.on('showHistoryChart', function(e, Site){
	Navigator.site.instance = Site;

	Navigator.site.title = Site.getTitle();
	Navigator.site.detailPageHref = '/list#' + Site.getProperty('SiteName');
	Navigator.site.siteDatasource = Site.getJsonLink();
	
	var Moment = moment(Site.getProperty('Data')['Create_at']);
	Navigator.site.lastUpdate = Moment.fromNow() + ' (' + Moment.format('YYYY-MM-DD HH:mm') + ')';
	
	loadSiteHistoryChart();
});
$body.on('infoWindowClose', function(e, Site){
	Navigator.site.instance = null;
	Navigator.site.title = '';
	Navigator.site.siteDatasource = '';
	Navigator.site.lastUpdate = '';
	Navigator.site.chartLoading = false;
	
	var SiteHistoryChart = require("js/site-history-chart");
	SiteHistoryChart.clear();
});