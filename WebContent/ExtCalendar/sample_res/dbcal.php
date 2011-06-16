<?php 
$datafn = $_POST['action']; 
$server = "localhost"; 
$db		= "tests_cms"; $user	= "root";$pass	= ""; 

//db connection 	
$link = mysqli_connect($server, $user, $pass) ;
if (mysqli_select_db($link,$db)==false){ 
	echo "{success:false,errors:'there's no database connection or database'}"; 
	exit();
} 	
if ($datafn=='all'){ 
	$sql = "SELECT  id, CONCAT(id,' - ',subject) as subjectx,description, 
	DATE_FORMAT(startdate,'%m/%d/%Y %h:%i:%S %p') as eventstarts,
	DATE_FORMAT(enddate,'%m/%d/%Y %h:%i:%S %p') as eventends,
  	finished, parent, priority FROM e2cs_test 
	WHERE NOW() between startdate and enddate or
	MONTH(startdate)=MONTH(now()) or MONTH(enddate)=MONTH(now())	
	ORDER BY id ASC"; 
} elseif ($datafn=='month'){ 
	$month = $_POST['displaymonth'];
	//08/11/2008 01:00:00 pm	 
	$sql = "SELECT  id, CONCAT(id,' - ',subject) as subjectx,description, 
	DATE_FORMAT(startdate,'%m/%d/%Y %h:%i:%S %p') as eventstarts,
	DATE_FORMAT(enddate,'%m/%d/%Y %h:%i:%S %p') as eventends,
  	finished, parent, priority FROM e2cs_test 
	WHERE ($month between MONTH(startdate) and MONTH(enddate)) or 
	MONTH (startdate)=$month or MONTH(enddate)=$month
	ORDER BY id ASC"; 
} elseif ($datafn=='day'){ 
	$str = $_POST['day']; 
	$timestamp = strtotime($str);
	$day = strftime ( "%Y-%m-%d" , $timestamp );
	$sql = "SELECT  id, CONCAT(id, ' - ', subject) AS subjectx,description,
	DATE_FORMAT(startdate,'%m/%d/%Y %h:%i:%S %p') as eventstarts,
	DATE_FORMAT(enddate,'%m/%d/%Y %h:%i:%S %p') as eventends,	
	finished, parent, priority FROM e2cs_test WHERE
	'$day' BETWEEN startdate AND enddate or 
	startdate LIKE ('$day%') or 
	startdate IN ('$day')	
	ORDER BY id ASC";
	//echo $sql; 
} elseif ($datafn=='week'){ 
	$str =  $_POST['weeknumber'];
	$initday =  $_POST['startweek']; $timestamp = strtotime($initday); $xinitday = strftime ( "%Y-%m-%d" , $timestamp );
	$endday =   $_POST['endweek'];   $timestamp = strtotime($endday);  $xendday =  strftime ( "%Y-%m-%d" , $timestamp );
	$sql = "SELECT  id, CONCAT(id, ' - ', subject) AS subjectx,description,
	DATE_FORMAT(startdate,'%m/%d/%Y %h:%i:%S %p') as eventstarts,
	DATE_FORMAT(enddate,'%m/%d/%Y %h:%i:%S %p') as eventends,	
	finished, parent, priority FROM e2cs_test WHERE
	(startdate BETWEEN '$xinitday 00:00:00' AND '$xendday 11:59:59') OR
	(enddate BETWEEN '$xinitday 00:00:00' AND '$xendday 11:59:59') OR
	(startdate <= '$xinitday 00:00:00' AND enddate >= '$xendday 11:59:59') OR
	($str BETWEEN WEEKOFYEAR(e2cs_test.startdate) AND WEEKOFYEAR(e2cs_test.enddate) ) OR
	WEEKOFYEAR(e2cs_test.startdate) = $str OR
	WEEKOFYEAR(e2cs_test.enddate) = $str	
	ORDER BY id ASC";	
} elseif ($datafn=='period'){	
	$initday =  $_POST['start']; $timestamp = strtotime($initday); $xinitday = strftime ( "%Y-%m-%d" , $timestamp );
	$endday =   $_POST['ends'];   $timestamp = strtotime($endday);  $xendday =  strftime ( "%Y-%m-%d" , $timestamp );
	$sql = "SELECT  id, CONCAT(id, ' - ', subject) AS subjectx,description,
	DATE_FORMAT(startdate,'%m/%d/%Y %h:%i:%S %p') as eventstarts,
	DATE_FORMAT(enddate,'%m/%d/%Y %h:%i:%S %p') as eventends,	
	finished, parent, priority FROM e2cs_test WHERE
	(startdate BETWEEN '$xinitday 00:00:00' AND '$xendday 11:59:59') OR
	(enddate BETWEEN '$xinitday 00:00:00' AND '$xendday 11:59:59') OR
	(startdate <= '$xinitday 00:00:00' AND enddate >= '$xendday 11:59:59')
	ORDER BY id ASC";	
} else { 
	echo "{success:false,errors:'there's enough arguments to generate data'}"; 
	exit();
} 
	$rs = mysqli_query($link,$sql);
	$num_rows = mysqli_num_rows($rs);
	if ($rs){
		$datareturn.= "["; 		
		while($data = mysqli_fetch_array($rs,MYSQLI_BOTH)) {
				if ($data['priority']==0){ $eventcolor='#F7C9F7'; } 
				if ($data['priority']==1){ $eventcolor='#AAF7A8'; } 
				if ($data['priority']==2){ $eventcolor='#D77472'; } 
				if ($data['priority']==3){ $eventcolor='#FFFBA5'; }
				if ($data['priority']==4){ $eventcolor='#FFBDB4'; }
				if ($data['priority']==5){ $eventcolor='#7799BF'; }
				if ($data['priority']==6){ $eventcolor='#94B98D'; }
				$datareturn.= '{"id":"' . $data['id'] . '","subject":"' . $data['subjectx'] .  '"'; 
				$datareturn.= ',"description":"' . $data['description'] . '","startdate":"' . $data['eventstarts'] .  '"'; 
				$datareturn.= ',"enddate":"' . $data['eventends'] . '","color":"' . $eventcolor .  '"';
				$datareturn.= ',"parent":"' . $data['parent'] . '","priority":"'. $data['priority'] . '"},';			
		}
		if (strlen($datareturn)>1){ 
			$datareturn =  substr($datareturn,0,strlen($datareturn)-1); 
		}
		$datareturn.= "]"; 
		echo "{success:true,totalCount:$num_rows,records:"  .  $datareturn .  "}";	
	} else { 
		echo '{success:false,error:"there is no info, please check or capturenew info"}'; 
	} 	
	mysqli_close($link );
?>