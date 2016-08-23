<?php
	$url = "https://airbox.edimaxcloud.com/query_history_raw";
	$token = 'EC519D9C-6363-4FBE-BEDE-2B10B18B4670';

	$param = ['token='.$token];
	if( count($_GET) ){		
		foreach($_GET as $key => $value){
			$param[] = $key . "=" . $value;
		}		
	}

	//do not use urlencode, only replace space to %20
	$param = implode('&', $param);
	$param = str_replace(' ', '%20', $param);

	$url .= '?'.$param;

	// echo $url;
	header('Content-Type: application/json');
	echo file_get_contents($url);