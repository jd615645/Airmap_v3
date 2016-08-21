require("css/map-infowindow.css");

var LANG = require("js/lang");
var GaugeChart = require("js/site-gauge-chart");

function InfoWindowLayer(){
	this.containerID = 'iw-container';	
	this.div = null;
	this.position = null;
	this.displayTime = 0;
	this.map = MapHandler.getInstance();
	this.setMap(this.map);
};

InfoWindowLayer.prototype = MapHandler.createOverlayView();

InfoWindowLayer.prototype.setSite = function(Site){
	this.Site = Site;
	this.position = Site.getMarker().getPosition();

	var indepPageLink = "/site#" + Site.getProperty('SiteGroup') + '-' + Site.getProperty('SiteName');
	var $container = $("#" + this.containerID);
	$container.find(".iw-name").text( Site.getTitle() );
	$container.find(".disqus-comment-count").attr('data-disqus-identifier', Site.getIdentity() );
	$container.find(".indep-page").attr('href', indepPageLink );
}

InfoWindowLayer.prototype.onAdd = function() {
	var html = [
		'<div id="' + this.containerID + '" >',
			'<div class="arrow"></div>',
			'<div class="iw-content">',
				'<div class="main-garge garge-background"></div>',
				'<div class="sub-garge">',
					'<div class="sub-garge-top garge-background"></div>',
					'<div class="sub-garge-bottom garge-background"></div>',
				'</div>',
			'</div>',
			'<div class="iw-title">',
				'<div class="iw-name"></div>',
				'<div class="iw-link">',
					'<a class="line-chart" title=":historyChart">',
						'<span class="glyphicon glyphicon-stats"></span>',
					'</a>',
					'<a href="" class="indep-page" title=":independentPage">',
						'<span class="glyphicon glyphicon-bookmark"></span>',
					'</a>',
				'</div>',
			'</div>',
		'</div>'
	].join('')
	.replace(':historyChart', LANG.get('historyChart'))
	.replace(':comment', LANG.get('siteComment'))
	.replace(':independentPage', LANG.get('independentPage'));

	this.div = $(html)[0];

	var self = this;
	var $body = $("body");

	//click outside to close navigator
	$body.click(function(e){
		if( $(e.target).parents(MapHandler.getContainer()).length ){
			var time = new Date().getTime();
			var isChildren = $.contains('#iw-container', e.target);
			if( !isChildren && (time - self.displayTime) > 1000 ){	//open 1 secs can remove, fix for event racing
				self.remove();
				$body.trigger('infoWindowClose', [self.Site]);
			}
		}
	});

	$body.on("click", '.iw-link a', function(e){
		if( $(this).hasClass("line-chart") ){
			$("body").trigger("openNavigator", ['siteChart']);
		}

		e.stopPropagation();
	});

	// Add the element to the "overlayLayer" pane.
	var panes = this.getPanes();
	panes.overlayMouseTarget.style.zIndex = 200;
	panes.overlayMouseTarget.appendChild(this.div);
};
InfoWindowLayer.prototype.draw = function() {
	if(!this.position){ return false; }

	var overlayProjection = this.getProjection();
	var point = overlayProjection.fromLatLngToDivPixel(this.position);

	var arrowHeight = 45;
	var $div = $('#' + this.containerID);
	var width = $div.width();
	var height = $div.height();

	var div = this.div;
	div.style.left = (point.x - width/2)+ 'px';
	div.style.top = (point.y - height - arrowHeight) + 'px';
};
InfoWindowLayer.prototype.onRemove = function() {
	this.div.parentNode.removeChild(this.div);
	this.div = null;
};
InfoWindowLayer.prototype.toggle = function(flag) {
	if( !this.div ){ return false; }

	if( typeof flag == "undefined" ){
		flag = this.div.style.visibility === 'hidden' ? true : false;	//reverse
	}else{
		flag = !!flag;
	}
	this.div.style.visibility = flag ? 'visible' : 'hidden';

	this.displayTime = new Date().getTime();
};

InfoWindowLayer.prototype.putOn = function(Site){
	this.setSite(Site);
	this.toggle(true);
	this.draw();
	this.map.setCenter(this.position);
	this.map.panBy(0, -100);
	this.initGauge();

	$("body").trigger('infoWindowReady', [this.Site]);
}

InfoWindowLayer.prototype.remove = function(){
	this.toggle(false);

	GaugeChart.clear();
	$("body").trigger('infoWindowClose', [this.Site]);
}

InfoWindowLayer.prototype.initGauge = function(){
	var chart = {
		main: {
			element: "#iw-container .main-garge",
			size: 'M',
			title: 'PM 2.5',
			measureType: 'PM2.5',
		},
		subTop: {
			element: "#iw-container .sub-garge-top",
			size: 'S',
			title: 'Temp',
			measureType: 'Temperature',
		},
		subBottom: {
			element: "#iw-container .sub-garge-bottom",
			size: 'S',
			title: 'RH',
			measureType: 'Humidity',
		}
	};

	chart.main.site = this.Site; 
	GaugeChart.init(chart.main);

	chart.subTop.site = this.Site;
	GaugeChart.init(chart.subTop);

	chart.subBottom.site = this.Site;
	GaugeChart.init(chart.subBottom);
}

module.exports = new InfoWindowLayer();