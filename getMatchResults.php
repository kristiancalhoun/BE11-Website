<?php

$matchRecordsFile = fopen("matchRecords.txt", "r");

$matchRecords = array();
if ($matchRecordsFile) {
    while (($record = fgets($matchRecordsFile)) !== false) {
        array_push($matchRecords, json_decode($record));
    }
    if (!feof($matchRecordsFile)) {
        echo "Error: unexpected fgets() fail\n";
    }
    fclose($matchRecordsFile);
}

echo json_encode($matchRecords);
?>