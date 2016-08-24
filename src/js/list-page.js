require("expose?bsTable!./list-table");
require("expose?jQuery!jquery");

moment.locale('zh-tw');
moment.updateLocale('zh-tw', {
	relativeTime: {
		m : '1分鐘',
		h : '1小時',
		d : '1天',
		M : '1個月',
		y : '1年',
	}
});



$(function(){
	// siteName hashtag
	var siteName = window.location.hash.substr(1);	
	$(".bsTable").on('load-success.bs.table', function(e, data){
		bsTable.event.loadSiteGroup($(this), data);

		if(siteName){
			$(".bootstrap-table .search input").val(siteName).trigger('keyup');
		}
	});

	$(".bsTable").on('click-row.bs.table', function(e, row, $tr){
		if ($tr.next().is('tr.detail-view')) {
			$(this).bootstrapTable('collapseRow', $tr.data('index'));
		} else {
			$(this).bootstrapTable('expandRow', $tr.data('index'));
		}
	});

	google.maps.event.addDomListener(window, "load", function(){
		var geocoder = new google.maps.Geocoder();
		var getAddr = function(lat, lng, cb){
			var coord = new google.maps.LatLng(lat, lng);
			geocoder.geocode({'latLng': coord }, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK && results) {					
					cb(results[0].formatted_address);
					return;
				}
				cb('');
			});
		}

		$("body").on("mouseover", "a.latlng", function(){
			var $el = $(this);
			var [lat, lng] = $(this).data('latlng').split(',');
			getAddr(lat, lng, function(addr){
				$el.attr('title', addr + ` (${$el.data('latlng')})` );
			});			
		});
	});
});