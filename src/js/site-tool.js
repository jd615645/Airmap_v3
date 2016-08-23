var Site = require("js/site-model");
var Navigator = require("js/navigator-handler");

var siteTool = (function(){
	var showLayer = true;
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
			
			var usingAnimation = false;
			var delayms = 30;
			var validSiteCount = 0;

			var titles = getSitesTitle();
			
			for(var i in data){
				var title = encodeURIComponent(data[i]['SiteGroup']+data[i]['SiteName']);
				if( typeof titles[title] != "undefined" ){
					//update
					var siteIndex = titles[title]
					var site = sites[siteIndex];
					site.setProperties(data[i]);
					site.updateMarkerColor();

					delete titles[title];
				}else{
					//add
					var site = new Site(data[i]);
					if( !site.isValid() ){ continue; }

					
					if( usingAnimation ){						
						(function(x, Site, showLayer){
							setTimeout(function(){ 
								Site.createMarker({onMap: showLayer});
							}, x * delayms);
						})(validSiteCount, site, showLayer);
						validSiteCount++;
					}else{
						site.createMarker({onMap: showLayer});
					}

					add(site);
				}
			}

			// delete
			for(var i in titles){
				var siteIndex = titles[i];
				var site = sites[siteIndex];

				if(site.toggleMarker){ site.toggleMarker(false); }
				sites.splice(siteIndex, 1);
			}
			
			if( usingAnimation ){
				setTimeout(function(){
					$("body").trigger("makerLoadCompelete");
					toggleLayer(showLayer);
				},  validSiteCount * delayms);
			}else{
				$("body").trigger("makerLoadCompelete");
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