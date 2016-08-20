<?php
date_default_timezone_set('Asia/Taipei');

$memcache = new Memcached;
$memcacheKeyPrefix = 'nGVA2HhYph5i1b8Byx8642Gw4s3ug1li';

$jsonType = call_user_func(function(){
	$matches = [];
	preg_match("/\/([a-zA-Z]+).json/", $_SERVER['REQUEST_URI'], $matches);
	return isset($matches[1]) ? $matches[1] : null;
});

$sites = $memcache->get($memcacheKeyPrefix . $jsonType);
if( $sites === false ){
	$sites = [];
}

setExpire();
jsonResponse($sites);


function setExpire($secs = 1800){		
	header("Cache-Control: max-age={$secs}, must-revalidate"); 		
	header("Expires: " . gmdate("D, d M Y H:i:s", time() + $secs) . " GMT");
}

function jsonResponse($response){		
	if( is_array($response) ){
		$response = json_encode($response);
	}

	header('Content-Type: application/json');
	echo $response;
	exit;
}