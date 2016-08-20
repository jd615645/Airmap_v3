<?php
	$url = "http://nrl.iis.sinica.edu.tw/LASS/history.php";

	if( count($_GET) ){
		$param = [];
		foreach($_GET as $key => $value){
			$param[] = $key . "=" . $value;
		}
		$url .= "?" . implode("&", $param);
	}

	// echo $url;
	header('Content-Type: application/json');
	echo file_get_contents($url);