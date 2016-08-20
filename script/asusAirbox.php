<?php
	$param = parseParam();
	$url = getUrl($param);
	header('Content-Type: application/json');
	echo fetch($url);

	function fetch($url){
		$opts = array(
			'http'=>array(
				'method'=>"GET",
				'header'=>"Prefix: 781463DA"
				)
			);
		$context = stream_context_create($opts);
		return file_get_contents($url, false, $context);	
	}

	function parseParam(){
		$path = $_SERVER['REQUEST_URI'];

		$pattern = '/\/json\/asusAirbox\.json\/?/';
		$path = preg_replace($pattern, '', $path);
		$param = explode("/", $path);

		return [
			'id' => $param[0],
			'startTimeStamp' => $param[1],
			'endTimeStamp' => $param[2],
		];
	}

	function getUrl($param){
		extract($param);
		$prefix = "http://airbox.asuscloud.com/airbox/";

		//time query
		if( strlen($id) && strlen($startTimeStamp) && strlen($endTimeStamp) ){
			$url = "device/{$id}/{$startTimeStamp}/{$endTimeStamp}";
			return $prefix . $url;
		}

		if( strlen($id) && !strlen($startTimeStamp) && !strlen($endTimeStamp) ){
			$url = "device/{$id}";
			return $prefix . $url;
		}

		//messages
		$url = "messages/";
		return $prefix . $url;
	}
