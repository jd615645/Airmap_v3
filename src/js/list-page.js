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
});