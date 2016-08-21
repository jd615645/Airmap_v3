var SiteResource = require("js/site-resource");
var Indicator = require("js/measure-indicator");

function Site(data){
	this.property = {};
	this.marker = null;

	this.setProperties(data);
	this.resource = SiteResource(this);

	//events	
	$("body").on("indicatorTypeChange", function(e, type){
		this.updateMarkerColor();
	}.bind(this));
}

Site.prototype.setProperties = function(item){
	if( !item || !item.Data || !item.Data.Create_at ){
		return false;
	}

	this.property = item;
};

Site.prototype.isValid = function(){
	var item = this.property;

	//time filter
	if( moment().diff(moment(item.Data.Create_at), 'minutes') > 60 ){
		return false;
	}

	//location filter
	if( !item.LatLng || !item.LatLng.lng || !item.LatLng.lat ){
		return false;
	}

	return true;
};

Site.prototype.getProperty = function(key){
	if( this.property[key] ){
		return this.property[key]
	}
	return null;
};

Site.prototype.getResource = function(){
	return this.resource;
}

Site.prototype.getMeasure = function(measureType){
	if( measureType == 'PM2.5' ){ measureType = 'Dust2_5'; }
	if( measureType == 'PM2.5_NASA' ){ measureType = 'Dust2_5'; }

	if( this.property['Data'][measureType] != undefined ){
		return parseFloat(this.property['Data'][measureType]);
	}

	if( this.property['RawData'][measureType] != undefined ){
		return parseFloat(this.property['RawData'][measureType]);
	}

	return null;
};

Site.prototype.getIdentity = function(){
	var identify = this.getProperty('SiteGroup') + '-' + this.getResource().getIdentity();
	return identify.replace(/[_\.]/, '-');
}

Site.prototype.getTitle = function(){
	return '[' + this.getProperty('SiteGroup') + '] ' + this.getProperty('SiteName');
}

Site.prototype.getJsonLink = function(){
	
	return this.resource ? this.resource.jsonLink : '';
}

Site.prototype.getMeasureColor = function(){
	var measureType = Indicator.getPresentType();
	var value = this.getMeasure(measureType);
	return value != null ? Indicator.getLevelColor(value) : 'transparent';
}

Site.prototype.getPosition = function(){
	var LatLng = this.getProperty('LatLng');
	if( LatLng && LatLng.lat && LatLng.lng ){
		return MapHandler.createLatLng(LatLng.lat, LatLng.lng);
	}
	return null;
}

Site.prototype.getIconSVG = function(size){
	var iconSvg = [
		'<svg width="30" height="30" viewBox="-40 -40 100 80" xmlns="http://www.w3.org/2000/svg">',
		// '	<defs>',
		// '		<filter id="dropshadow" height="150%">',
		// '			<feGaussianBlur in="SourceAlpha" stdDeviation="1"/> ',
		// '			<feOffset dx="3" dy="3" result="offsetblur"/> ',
		// '			<feMerge> ',
		// '				<feMergeNode/>',
		// '				<feMergeNode in="SourceGraphic"/> ',
		// '			</feMerge>',
		// '		</filter>',
		// '	</defs>',
		// '	<circle r="{{size}}" stroke="#FFFFFF" stroke-width="3" fill="{{background}}" filter="url(#dropshadow)"/>',
		'	<circle r="{{size}}" stroke="#FFFFFF" stroke-width="3" fill="{{background}}"/>',
		// '	<text x="0" y="13" fill="#232F3A" text-anchor="middle" style="font-size:35px; font-weight: bolder;">{{text}}</text>',
		'</svg>'
	].join('');

	var color = '#006699';
	var text = '';
	if( typeof Indicator !== "undefined" ){
		var measureType = Indicator.getPresentType();
		text = this.getMeasure(measureType) ? Math.round(this.getMeasure(measureType)) : '';
		color = this.getMeasureColor();
	}	

	var url = 'data:image/svg+xml;charset=utf-8,' + 
			   encodeURIComponent( 
			     iconSvg.replace('{{background}}', color).replace('{{size}}', size || 40).replace('{{text}}', text)
			   );

	return {
		anchor: MapHandler.createPoint(10, 10),
		url: url
	};
}

Site.prototype.getIconImage = function(){
	var color = '';
	var text = '';
	if( typeof Indicator !== "undefined" ){
		var measureType = Indicator.getPresentType();
		text = this.getMeasure(measureType) ? Math.round(this.getMeasure(measureType)) : '';
		color = this.getMeasureColor();
		if(color == "transparent"){ color = ''; }
	}
	var url = [
		"/image/markerIcon?",
		"color=" + color.replace('#', ''),
		"number=" + text
	].join('&');
	
	return {
		url: url,
		scaledSize: MapHandler.createSize(30, 30),
		value: text,
	}
}

Site.prototype.createMarker = function(options){
	options = options || {};	
	var position = this.getPosition();
	if( !position ){
		console.log("position not avaliable");
		return false;
	}

	var option = {
		'title': this.getTitle(),
		'position': position,
		'map': options.onMap ? MapHandler.getInstance() : null,
	};
	delete options.onMap;

	//get icon
	// var icon = this.getIconSVG();
	var icon = this.getIconImage();
	if(icon){ option['icon'] = icon; }

	this.marker = MapHandler.createMarker( $.extend({}, option, options) );

	MapHandler.addListener('click', function(){
		this.openInfoWindow();
	}.bind(this), this.marker);
}

Site.prototype.getMarker = function(){
	return this.marker;
}

Site.prototype.toggleMarker = function(flag){
	if( !this.marker ){ return false; }

	if( typeof flag == "undefined" ){
		flag = this.marker.getMap() == null ? true : false; //reverse
	}else{
		flag = !!flag;
	}
	var map = MapHandler.getInstance();
	this.marker.setMap( flag ? map : null );
}

Site.prototype.updateMarkerColor = function(){
	var marker = this.getMarker();
	if( marker ){
		// marker.setIcon(this.getIconSVG());
		marker.setIcon(this.getIconImage());
	}
}

Site.prototype.openInfoWindow = function(){	
	var InfoWindowLayer = require("js/map-infowindow-layer");
	InfoWindowLayer.putOn(this);
}

module.exports = Site;