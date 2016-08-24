module.exports = {
	formatter: {
		sn: function(value, row, index){
			return 1+index;
		},
		location: function(value, row, index){
			// var url = "https://www.google.com.tw/maps/place/" + value.lat + ',' + value.lng;
			var url = "/@" + value.lat + ',' + value.lng;
			var text = [value.lat, value.lng].join(', ');
			return "<a href='" + url + "' target='_blank' title='" + text + "'><span class='glyphicon glyphicon-map-marker'></span></a>";
		},
		detail: function(index, row, element){
			return [
				"<div class='col-sm-6'>",
				bsTable.generate.table("<h4>Data</h4>", ['Type', 'Value'], row.Data),
				"</div>",
				"<div class='col-sm-6'>",
				bsTable.generate.table("<h4>RawData</h4>", ['Type', 'Value'], row.RawData),
				"</div>",
			].join('');
		},
		updateTime: function(time){
			var human = moment(time).fromNow();
			var dataTime = moment(time).format('YYYY-MM-DD HH:mm');
			return '<span title="' + dataTime + '">' + human + ' <span class="glyphicon glyphicon-time"></span></span>';
		},
		siteName: function(name, row){
			var url = "/site#" + row.SiteGroup + '-' + name;
			return "<a href='" + url + "' target='_blank'>" + name + "</a>";
		},
	},
	generate: {
		siteOptions: function(data){
			var siteGroups = [];
			data.map(function(site){
				if( siteGroups.indexOf(site.SiteGroup) < 0){
					siteGroups.push(site.SiteGroup);
				}
			});

			var options = "<option value='all'>All</option>";
			siteGroups.map(function(name){
				options += "<option value='" + name + "'>" + name + "</option>";
			});

			return options;
		},
		table: function(title, head, body){
			var headHtml = '<tr><th>' + head.join('</th><th>') + '</th></tr>';
			
			var bodyHtml = '';
			for(var index in body){
				var value = body[index];
				console.log(index, value);
				bodyHtml += [
					'<tr><td>',
					index,
					"</td><td>",
					value,
					"</td></tr>"
				].join('');
			}

			return [
				title,
				"<table class='table table-striped'>",
				"<thead>",
				headHtml,
				"</thead>",
				"<tbody>",
				bodyHtml,
				"</tbody>",
				"</table>",
			].join('');
		}
	},
	event: {
		loadSiteGroup: function($table, data){
			var $select = $( $table.data('toolbar') ).find('select[name=siteGroup]');
			$select.html(bsTable.generate.siteOptions(data));
			
			$select.change(function(){
				var group = $(this).val();

				var filterValue = null;
				if( group != 'all' ){
					filterValue = group;
				}

				bsTable.event.filter($table, 'SiteGroup', filterValue);
			});
		},
		filter: function($table, key, value){
			var filter = $table.data('filter') || {};

			if( value == null && filter[key] ){
				delete filter[key];
			}else{
				filter[key] = value;
			}					

			$table.data('filter', filter)
				  .bootstrapTable('filterBy', filter);
		},
	}
}