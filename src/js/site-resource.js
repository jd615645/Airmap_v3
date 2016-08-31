var jqXHR = null;
function getSiteResource(site){
	var isHttps = location.protocol == "https:";
	if( !site ){ return null; }
	
	var ajaxRequest = function(url, param){
		if(jqXHR){ jqXHR.abort(); }
		
		if(!param){ param = {}; }
		var options = $.extend({
			dataType: "json",
			url: url,
		}, param);

		return new Promise(function(resolve, reject){
			jqXHR = $.ajax(options);

			jqXHR.then(function(data){
		    	resolve(data);
		    }).fail(function(jqXHR, textStatus, errorThrown){
		    	reject(jqXHR);
		    });
		});
	}

	var lass = function(){
		var deviceID = site.getProperty('RawData')['device_id'];
		
		var getIdentity = function(){
			return site.getProperty('RawData')['device_id'];
		};
		var getLastestData = function(cb){
			var url = "http://nrl.iis.sinica.edu.tw/LASS/last.php?device_id=:id";
			url = url.replace(':id', deviceID);

			return ajaxRequest(url).then(function(data){
				return new Promise(function(resolve, reject){
					resolve({
						url: url,
						feeds: data['feeds']
					});
				});	
			});
		};
		var getRangeData = function(range, cb){
			var url = "http://nrl.iis.sinica.edu.tw/LASS/history.php";
			if(isHttps){ url = "/json/sinicaHistory.json"; }

			var param = {
				device_id: deviceID,
				start: moment().utc().add(-1, range).format().replace('+00:00', 'Z'),
				end: moment().utc().format().replace('+00:00', 'Z'),
				results: 8000,
			}

			return ajaxRequest(url, {data: param}).then(function(data){
				return new Promise(function(resolve, reject){
					resolve({
						url: url + '?' + $.param(param),
						feeds: data['feeds']
					});
				});			
			});
		};
		var chartDataTransform = function(feeds){
			var xAxis = [];
			var measures = {};
			var indexMapping = {
				's_d0': 'PM2.5',
				's_t0': 'Temperature',
				's_h0': 'Humidity',
			};

			feeds.map(function(feed){
				for(var index in feed){
					if( indexMapping[index] ){
						var type = indexMapping[index];
						var value = feed[index];

						if( !measures[type] ){ measures[type] = []; }
						measures[type].push(value);
					}
				}

				var label = moment(feed['timestamp']).format('MM-DD HH:mm');
				xAxis.push(label);
			});

			return {
				xAxis: xAxis,
				measures: measures,
			}
		};

		return {
			jsonLink: "http://nrl.iis.sinica.edu.tw/LASS/history-hourly.php?device_id=" + deviceID,
			getIdentity: getIdentity,
			getLastestData: getLastestData,
			getRangeData: getRangeData,
			chartDataTransform: chartDataTransform,
		}
	}

	var airbox_asus = function(){
		var deviceID = site.getProperty('RawData')['id'] || site.getProperty('RawData')['device_id'];
		var momentFormat = 'x';

		var getIdentity = function(){
			return deviceID;
		};
		var getLastestData = function(cb){
			var url = "https://airbox.asuscloud.com/airbox/device/" + deviceID;

			return ajaxRequest(url, {
				headers: { "Prefix": "781463DA" }
			}).then(function(data){
				return new Promise(function(resolve, reject){
					resolve({
						url: url,
						feed: data
					});
				});			
			});
		};
		var getRangeData = function(range, cb){
			var url = "https://airbox.asuscloud.com/airbox/device/:id/:startTimestamp/:endTimestamp";
			
			url = url.replace(':id', deviceID);
			url = url.replace(':startTimestamp', moment().add(-1, range).format(momentFormat) );
			url = url.replace(':endTimestamp', moment().format(momentFormat));

			return ajaxRequest(url).then(function(data){
				return new Promise(function(resolve, reject){
					resolve({
						url: url,
						feeds: data
					});
				});			
			});
		};
		var chartDataTransform = function(feeds){
			var xAxis = [];
			var measures = {};
			var indexMapping = {
				's_d0': 'PM2.5',
				's_t0': 'Temperature',
				's_h0': 'Humidity',
			};

			feeds.map(function(feed){
				for(var index in feed){
					if( indexMapping[index] ){
						var type = indexMapping[index];
						var value = feed[index];

						if( !measures[type] ){ measures[type] = []; }
						measures[type].push(value);
					}
				}

				var label = moment(feed['time'] + ' +0800').format('MM-DD HH:mm');			
				xAxis.push(label);
			});

			return {
				xAxis: xAxis,
				measures: measures,
			}
		};
		return {
			jsonLink: "http://airbox.asuscloud.com/airbox/device/" + deviceID,
			getIdentity: getIdentity,
			getLastestData: getLastestData,
			getRangeData: getRangeData,
			chartDataTransform: chartDataTransform,
		}
	};

	var airbox_edimax = function(){
		var deviceID = site.getProperty('RawData')['id'] || site.getProperty('RawData')['device_id'];
		var momentFormat = 'YYYY-MM-DD HH:mm:ss';

		var getIdentity = function(){
			return deviceID;
		};
		var getLastestData = function(cb){
			//haven't api
			return new Promise.resolve({
				url: "",
				feed: {}
			});

			var url = "" + deviceID;

			return ajaxRequest(url).then(function(data){
				return new Promise(function(resolve, reject){
					resolve({
						url: url,
						feed: data
					});
				});			
			});
		};
		var getRangeData = function(range, cb){
			var url = "/json/edimaxAirboxHistory.json";
			var param = {
				id: deviceID,
				start: moment().add(-1, range).format(momentFormat),
				end: moment().format(momentFormat),
			};

			return ajaxRequest(url, {data: param}).then(function(data){
				return new Promise(function(resolve, reject){
					param.token = 'YOUR TOKEN HERE';
					resolve({
						url: url + '?' + $.param(param),
						feeds: data['entries']
					});
				});			
			});
		};
		var chartDataTransform = function(feeds){
			var xAxis = [];
			var measures = {};
			var indexMapping = {
				's_d0': 'PM2.5',
				's_t0': 'Temperature',
				's_h0': 'Humidity',
			};

			feeds.map(function(feed){
				for(var index in feed){
					if( indexMapping[index] ){
						var type = indexMapping[index];
						var value = feed[index];

						if( !measures[type] ){ measures[type] = []; }
						measures[type].push(value);
					}
				}

				var label = moment(feed['time'] + ' +0800').format('MM-DD HH:mm');			
				xAxis.push(label);
			});

			return {
				xAxis: xAxis,
				measures: measures,
			}
		};
		return {
			jsonLink: "https://airbox.edimaxcloud.com",
			getIdentity: getIdentity,
			getLastestData: getLastestData,
			getRangeData: getRangeData,
			chartDataTransform: chartDataTransform,
		}
	};

	var thingspeak = function(){
		var deviceID = site.getProperty('Channel_id') || site.getProperty('RawData')['device_id'].replace(/\D/g, '');	//replace prefix PC_XXXXXX
		var apiUrl = "https://api.thingspeak.com/channels/:id/feeds.json".replace(':id', deviceID);
		var momentFormat = "YYYY-MM-DD HH:mm:ss";
		var fieldMapping = {};

		var getIdentity = function(){
			return site.getProperty('RawData')['entry_id'];
		};
		var parsefieldMapping = function(channelInfo){
			for(var index in channelInfo){
				if( index.indexOf('field') < 0 ){ continue; }

				fieldMapping[index] = channelInfo[index];
			}
		}
		var getLastestData = function(cb){
			var param = {
				results: 1,
				timezone: 'Asia/Taipei',
			}

			return ajaxRequest(url, {data: param}).then(function(data){
				parsefieldMapping(data.channel);
				return new Promise(function(resolve, reject){
					resolve({
						url: url,
						feeds: data['feeds']
					});
				});			
			});
		};
		var getRangeData = function(range, cb){
			//thingspeak api can't url encode
			var param = [];
			param.push('start=' + moment().add(-1, range).format(momentFormat));
			param.push('end=' + moment().format(momentFormat));
			param.push('timezone=Asia/Taipei');

			var url = apiUrl + '?' + param.join('&');

			return ajaxRequest(url).then(function(data){
				parsefieldMapping(data.channel);
				return new Promise(function(resolve, reject){
					resolve({
						url: url,
						feeds: data['feeds']
					});
				});			
			});
		};
		var chartDataTransform = function(feeds){
			var xAxis = [];
			var measures = {};

			feeds.map(function(feed){
				for(var index in feed){
					var value = feed[index];

					if(index.indexOf('field') > -1 && value){
						var type = fieldMapping[index];
						if( !measures[type] ){ measures[type] = []; }

						measures[type].push(value);
					}
				}

				var label = moment(feed['created_at']).format('MM-DD HH:mm');
				xAxis.push(label);
			});

			return {
				xAxis: xAxis,
				measures: measures,
			}
		}		

		return {
			jsonLink: "http://api.thingspeak.com/channels/" + deviceID,
			getIdentity: getIdentity,
			getLastestData: getLastestData,
			getRangeData: getRangeData,
			chartDataTransform: chartDataTransform,
		}
	};

	var epa = function(){
		var apiUrl = "https://taqm.g0v.asper.tw/site-:id-lastest.json".replace(':id', deviceID);
		var deviceID = site.getProperty('Channel_id');
		var momentFormat = "YYYY-MM-DD HH:mm:ss";
		var fieldMapping = {};

		var getIdentity = function(){
			return deviceID;
		};
		var getLastestData = function(cb){
			return ajaxRequest(apiUrl).then(function(data){
				return new Promise(function(resolve, reject){
					resolve({
						url: apiUrl,
						feed: data['data']
					});
				});			
			});
		};
		var getRangeData = function(range){
			var url = "https://taqm.g0v.asper.tw/site-:id.json".replace(':id', deviceID);

			return ajaxRequest(url).then(function(data){				
				var feeds = [];
				for(var i in data['data']){
					var feed = data['data'][i];
					if( ["PM2.5", "AMB_TEMP", "RH"].indexOf(feed['type']) < 0 ){ continue; }

					feeds.push(feed);
				}

				return new Promise(function(resolve, reject){
					resolve({
						url: url,
						feeds: feeds
					});
				});			
			});
		};
		var chartDataTransform = function(feeds){
			var xAxis = [];
			var measures = {};
			var indexMapping = {
				'PM2.5': 'PM2.5',
				'AMB_TEMP': 'Temperature',
				'RH': 'Humidity',
			};

			for(var i in feeds[0]['values']){
				var date = feeds[0]['year'] + '-' + feeds[0]['month'] + '-' + feeds[0]['day'] + ' ' + i + ':00 +0800';
				var label = moment(date).format('MM-DD HH:mm');
				xAxis.push(label);
			}

			feeds.map(function(feed){
				var type = indexMapping[feed['type']];
				measures[type] = feed['values'].map( value => {
					return isNaN(value) ? 0 : value;
				})
			});

			return {
				xAxis: xAxis,
				measures: measures,
			}
		}		

		return {
			jsonLink: apiUrl,
			getIdentity: getIdentity,
			getLastestData: getLastestData,
			getRangeData: getRangeData,
			chartDataTransform: chartDataTransform,
		}
	};

	var empty = function(){
		var getRangeData = function(range){
			return new Promise(function(resolve, reject){
				resolve({ url: '', feeds: [] });
			});
		};
		var chartDataTransform = function(feeds){
			return { xAxis: [], measures: {} };
		}
		return {
			jsonLink: '#',
			getIdentity: function(){ return ''; },
			getLastestData: function(cb){ return cb({}); },
			getRangeData: getRangeData,
			chartDataTransform: chartDataTransform,
		}
	}

	var resource;
	var siteGroup = site.getProperty('SiteGroup').toLowerCase();
	

	switch(siteGroup){
		case 'epa': 	resource = epa(); 	break;
		case 'lass': 	resource = lass(); 		break;
		case 'airbox_asus': 	resource = airbox_asus(); 	break;
		case 'airbox_edimax': 	resource = airbox_edimax(); 	break;
		
		case 'probecube':
		case 'miaoski':	
		case 'ccu 100':	
		case 'ccu neat':
		case 'es-air':	
		case 'ks-001':	
			resource = thingspeak();	break;
		default:
			resource = empty();
	}

	return {
		jsonLink: resource.jsonLink,
		getLastestData: resource.getLastestData,
		getRangeData: resource.getRangeData,
		getIdentity: resource.getIdentity,
		getHourlyData: function(cb){
			return resource.getRangeData('hours', cb);
		},
		getDailyData: function(cb){
			return resource.getRangeData('days', cb);
		},
		getWeeklyData: function(cb){
			return resource.getRangeData('weeks', cb);
		},
		getMonthlyData: function(cb){
			return resource.getRangeData('months', cb);
		},
		getChartData: function(data){
			var feedsData = resource.chartDataTransform(data);
			var datasets = [];

			for(var label in feedsData.measures){
				var measure = feedsData.measures[label];
				datasets.push({
					label: label,
					data: measure,
				})
			}

			return {
				labels: feedsData.xAxis,
				datasets: datasets,
			}
		},
	}

	
}

module.exports = getSiteResource;