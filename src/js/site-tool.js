var Site = require("js/site-model");
var MarkerClusterer = require("js/vendor/markerclusterer");

var isMobile = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

var siteTool = (function(){
	var showLayer = true;
	var markerCluster = null;
	var sites = [];
	var groups = {};
	var add = function(site){
		sites.push(site);
	};
	var clear = function(){
		for(var i in sites){
			var site = sites[i];
			if(site.toggleMarker){ site.toggleMarker(false); }
			delete sites[i];
		}
		sites = [];
	};
	var getGroups = function(){
		if( !Object.keys(groups).length ){
			for(var i in sites){
				var site = sites[i];
				var siteGroup = site.getProperty('SiteGroup');

				if( siteGroup.length ){
					if(!groups[siteGroup]){ groups[siteGroup] = 0;	}
					groups[siteGroup]++;
				}
			}
		}

		return groups;
	};

	var toggleLayer = function(flag){
		if( typeof flag == "undefined" ){
			showLayer = !showLayer;
		}else{
			showLayer = !!flag;
		}			

		for(var i in sites){
			var site = sites[i];
			site.toggleMarker(showLayer);
		}
		return showLayer;
	};

	var getSitesTitle = function(){
		var titles = {};
		for(var i in sites){
			var site = sites[i];
			var hash = encodeURIComponent(site.getProperty('SiteGroup')+site.getProperty('SiteName'));
			titles[hash] = i;
		}
		return titles;
	}

	var calcSitesInView = function(){
		var sitesCountInView = 0;
		var Bounds = MapHandler.getInstance().getBounds();
		for(var i in sites){
			var site = sites[i];
			if( Bounds.contains(site.getPosition()) ){
				sitesCountInView++;
			}
		}
		$("#info-on-map .text").text(sitesCountInView);
	}

	var boot = function(){
		//bind events
		MapHandler.addListener('bounds_changed', function(){
			calcSitesInView();
		});
	}	

	return {
		boot: boot,
		add: add,
		clear: clear,
		getGroups: getGroups,
		changeGroups: function(activeGroups){
			for(var i in sites){
				var site = sites[i];
				var group = site.getProperty('SiteGroup');
				
				var isShow = activeGroups.indexOf(group) > -1;
				site.toggleMarker(isShow);
			}
		},
		loadSites: function(data){
			if(!data || !data.length){ return false; }
			clear();

			var validSiteCount = 0;
			var markers = [];

			for(var i in data){
				var site = new Site(data[i]);
				if( !site.isValid() ){ continue; }
				site.createMarker({onMap: !isMobile() });
				markers.push(site.getMarker());
				add(site);
			}

			if( isMobile() ){
				var mcOptions = {gridSize: 70, maxZoom: 15, minimumClusterSize: 5};
	        	markerCluster = new MarkerClusterer(MapHandler.getInstance(), markers, mcOptions);				
			}
			
			$("body").trigger("sitesLoaded", [getGroups()]);
			calcSitesInView();
		},
		toggleLayer: toggleLayer,
		getVoronoiData: function(){
			var locations = [];
			var colors = [];
			for(var i in sites){
				var site = sites[i];

				var LatLng = site.getPosition();
				locations[i] = [LatLng.lat(), LatLng.lng()];
				colors[i] = site.getMeasureColor();
			}
			return {
				locations: locations,
				colors: colors,
			}	
		},
	}
})();

//events
$("body").on("site_changeCategory", function(e, actives){
	siteTool.changeGroups(actives);
});

$("body").on("toggleLayer", function(e, type, state){
	if( type != 'siteLayer'){ return; }
	siteTool.toggleLayer(state);
});

module.exports = siteTool;