<?php

$matchRecordsFile = fopen("matchRecords.txt", "a");
$RF = intval($_POST['RF']);
$BF = intval($_POST['BF']);
$R1 = intval($_POST['R1']);
$R2 = intval($_POST['R2']);
$R3 = intval($_POST['R3']);
$B1 = intval($_POST['B1']);
$B2 = intval($_POST['B2']);
$B3 = intval($_POST['B3']);
$RB = intval($_POST['RB']);
$BB = intval($_POST['BB']);
$RFP = intval($_POST['RFP']);
$BFP = intval($_POST['BFP']);
$RHS = intval($_POST['RHS']);
$BHS = intval($_POST['BHS']);
$RTS = intval($_POST['RTS']);
$BTS = intval($_POST['BTS']);
$CP = intval($_POST['CP']);
$MC = intval($_POST['MC']);
$TY = $_POST['TY'];

$matchRecord = array('matchNumber' => $MC, 'type' => $TY,'red' => array($R1, $R2, $R3), 'blue' => array($B1, $B2, $B3), 'redFinal' => $RF, 'blueFinal' => $BF, 'redHybrid' => $RHS, 'blueHybrid' => $BHS, 'redTeleop' => $RTS, 'blueTeleop' => $BTS, 'redBridge' => $RB, 'blueBridge' => $BB, 'redFoul' => $RFP, 'blueFoul' => $BFP, 'CP' => $CP);
fwrite($matchRecordsFile, json_encode($matchRecord) . "\n");
fclose($matchRecordsFile);

echo json_encode($matchRecord);
?>