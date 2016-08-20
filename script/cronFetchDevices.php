<?php
date_default_timezone_set('Asia/Taipei');

$memcache = new Memcached;
$memcacheKeyPrefix = 'nGVA2HhYph5i1b8Byx8642Gw4s3ug1li';
// $memcacheExpireSecs = 1 * 60; //1 mins
$memcacheExpireSecs = 0 * 60; //1 mins

$sites = fetchRemote();
$memcache->set($memcacheKeyPrefix . 'airmap', json_encode($sites['valid']), $memcacheExpireSecs);
$memcache->set($memcacheKeyPrefix . 'deactivesite', json_encode($sites['inValid']), $memcacheExpireSecs);

function fetchRemote($jsonType){
	$sources = [
		// $g0vPrefix . "EPA_last.json",
		// $g0vPrefix . "ProbeCube_last.json",
		// $g0vPrefix . "LASS_last.json",
		// $g0vPrefix . "Airbox_last.json",
		// $g0vPrefix . "webduino_last.json",
		// "http://nrl.iis.sinica.edu.tw/LASS/last-all-airbox.json",
		// "http://nrl.iis.sinica.edu.tw/LASS/last-all-webduino.json",
		
		"http://taqm.g0v.asper.tw/airmap.json", //epa
		"http://nrl.iis.sinica.edu.tw/LASS/last-all-lass.json",
		"http://nrl.iis.sinica.edu.tw/LASS/last-all-probecube.json",
		"http://nrl.iis.sinica.edu.tw/LASS/last-all-lass4u.json",
		"http://g0vairmap.3203.info/Data/Indie_last.json",
		"https://airbox.edimaxcloud.com/devices?token=EC519D9C-6363-4FBE-BEDE-2B10B18B4670",
		'http://' . gethostname() . "/json/asusAirbox.json",
	];

	$validSites = [];
	$inValidSites = [];
	foreach($sources as $source){
		$url = $source;

		$response = file_get_contents($url);
		$data = json_decode($response, true);

		if( !is_array($data) || !count($data) ){
			continue;
		}

		if( strpos($source, "nrl.iis.sinica.edu.tw") !== false ){
			$data = sinicaConverter($source, $data);
		}

		if( strpos($source, "airbox.edimaxcloud.com") !== false ){
			$data = edimaxConverter($source, $data);
		}

		if( strpos($source, "asusAirbox") !== false ){
			$data = asusAirboxConverter($source, $data);
		}

		foreach($data as $item){
			$valid = filterCreateAt($item['Data']['Create_at']);

			if( $valid ){
				$validSites[] = $item;
			}else{
				$inValidSites[] = $item;
			}
		}
	}

	return ['valid' => $validSites, 'inValid' => $inValidSites ];
}


function filterCreateAt($timeStr){
	if( !strlen($timeStr) ){ return false; }

	$time = strtotime($timeStr);
	$gap = 60 * 60; //60mins

	return (bool)( (time() - $time) <= $gap );
}

function parseGroupName($source){
	$pattern = "/LASS\/last-all-(.*?)\.json$/";
	$matches = [];
	if( preg_match($pattern, $source, $matches) != 1 ){
		return false;
	}
	return isset($matches[1]) ? strtoupper($matches[1]) : false;
}

function edimaxConverter($source, $data){
	$feeds = [];
	$filterTypes = ['lass-airbox', 'taiwan-official'];
	$group = "Airbox_Edimax";

	foreach($data['devices'] as $feed){
		if( in_array($feed['type'], $filterTypes) ){
			continue;
		}

		$feed['device_id'] = $feed['id'];

		$ret = [
			'SiteName' => $feed['name'],
			'LatLng' => [
				'lat' => $feed['lat'],
				'lng' => $feed['lon'],
			],
			"SiteGroup" => $group,
			"Maker" => $group,
			"RawData" => $feed,
			"Data" => [
				'Create_at' 	=> gmdate('Y-m-d\TH:i:s\Z', strtotime($feed['time'])),
				'Temperature' 	=> $feed['t'],
				'Humidity' 		=> $feed['h'],
				'Dust2_5' 		=> $feed['pm25'],
			],
		];
		$feeds[] = $ret;
	}

	return $feeds;
}

function asusAirboxConverter($source, $data){
	$feeds = [];
	$group = "Airbox_Asus";

	foreach($data as $feed){
		$feed['device_id'] = $feed['id'];

		$ret = [
			'SiteName' => $feed['name'],
			'LatLng' => [
				'lat' => $feed['lat'],
				'lng' => $feed['lng'],
			],
			"SiteGroup" => $group,
			"Maker" => $group,
			"RawData" => $feed,
			"Data" => [
				'Create_at' 	=> gmdate('Y-m-d\TH:i:s\Z', strtotime($feed['time'])),
				'Temperature' 	=> $feed['temperature'],
				'Humidity' 		=> $feed['humidity'],
				'Dust2_5' 		=> $feed['pm25'],
			],
		];
		$feeds[] = $ret;
	}

	return $feeds;
}

function sinicaConverter($source, $data){
	$sinicaFieldMapping = [
		's_d0' => 'Dust2_5',
		's_d1' => 'PM10',
		's_d2' => 'PM1',
		's_h0' => 'Humidity',
		's_h2' => 'Humidity',
		's_t0' => 'Temperature',
	];

	$feeds = [];

	//parse group name
	$group = parseGroupName($source);
	if($group === false){ $group = "noGroup"; }
	if($group == "PROBECUBE"){ return sinicaProbecudeConverter($data['feeds']); }

	foreach($data['feeds'] as $feed){
		$Data = ['Create_at' => $feed['timestamp']];
		foreach($feed as $field => $value){
			if( !isset($sinicaFieldMapping[$field]) ){ continue; }
			$mapping = $sinicaFieldMapping[$field];
			$Data[$mapping] = $value;
		}

		$ret = [
			'SiteName' => $feed['SiteName'] ?: $feed['device_id'],
			'LatLng' => [
				'lat' => $feed['gps_lat'],
				'lng' => $feed['gps_lon'],
			],
			"SiteGroup" => $group,
			"Maker" => $group,
			"RawData" => $feed,
			"Data" => $Data,
		];
		$feeds[] = $ret;
	}

	return $feeds;
}


function sinicaProbecudeConverter($data){
	$group = "PROBECUBE";
	$feeds = [];

	foreach($data as $feed){
		$ret = [
			'SiteName' => $feed['SiteName'],
			'LatLng' => [
				'lat' => $feed['gps_lat'],
				'lng' => $feed['gps_lon'],
			],
			"SiteGroup" => $group,
			"Maker" => $group,
			"RawData" => $feed,
			"Data" => [
				'Create_at' 	=> $feed['timestamp'],
				'Temperature' 	=> $feed['Temperature'],
				'Humidity' 		=> $feed['Humidity'],
				'Dust2_5' 		=> $feed['PM2_5'],
			],
		];
		$feeds[] = $ret;
	}

	return $feeds;
}