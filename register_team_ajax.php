<?php

//Save all post variables
$contactname = $_POST['contactname'];
$teamnumber = $_POST['teamnumber'];
$schoolname = $_POST['schoolname'];
$schoollocation = $_POST['schoollocation'];
$teamname = $_POST['teamname'];
$email = $_POST['contactemail'];
$teamwebsite = $_POST['teamwebsite'];
$prerookie = $_POST['prerookie'];
$prerookieinfo = $_POST['prerookieinfo'];

//spam/abuse check and then send
$to      = "bharatnain@gmail.com, smwonder@comcast.net, kristian.calhoun@gmail.com, offseasonmanager@gmail.com";
$subject = $teamnumber ." has registered for Brunswick Eruption 11.";

$dodgy_strings = array(
                "content-type:"
                ,"mime-version:"
                ,"multipart/mixed"
                ,"bcc:"
);

function is_valid_email($email) {
  return preg_match('#^[a-z0-9.!\#$%&\'*+-/=?^_`{|}~]+@([0-9.]+|([^\s]+\.+[a-z]{2,6}))$#si', $email);
}

function contains_bad_str($str_to_test) {
  $bad_strings = array(
                "content-type:"
                ,"mime-version:"
                ,"multipart/mixed"
		,"Content-Transfer-Encoding:"
                ,"bcc:"
		,"cc:"
		,"to:"
  );
  
  foreach($bad_strings as $bad_string) {
    if(eregi($bad_string, strtolower($str_to_test))) {
      echo "$bad_string found. Suspected injection attempt - mail not being sent.";
      exit;
    }
  }
}

function contains_newlines($str_to_test) {
   if(preg_match("/(%0A|%0D|\\n+|\\r+)/i", $str_to_test) != 0) {
     echo "newline found in $str_to_test. Suspected injection attempt - mail not being sent.";
     exit;
   }
} 

if($_SERVER['REQUEST_METHOD'] != "POST"){
   echo("Unauthorized attempt to access page.");
   exit;
}

if (!is_valid_email($email)) {
  echo 'Invalid email submitted - mail not being sent.';
  exit;
}

contains_bad_str($email);
contains_bad_str($subject);
contains_bad_str($contactname);
contains_bad_str($teamnumber);
contains_bad_str($schoolname);
contains_bad_str($schoollocation);
contains_bad_str($teamname);
contains_bad_str($teamwebsite);
contains_bad_str($prerookie);
contains_bad_str($prerookieinfo);

contains_newlines($email);
contains_newlines($subject);
contains_newlines($contactname);
contains_newlines($teamnumber);
contains_newlines($schoolname);
contains_newlines($schoollocation);
contains_newlines($teamname);
contains_newlines($teamwebsite);
contains_newlines($prerookie);
//OK, checked for abuse.


//code to formulate email since spam and abuse check is done
	$header = "MIME-Version: 1.0 \r\n";
	$header .= "Content-type: text/html; charset=iso-8859-1\r\n";
	$header .= "To: ". $to ."\r\n";
	$header .= "From: ". $email ." <". $to .">\r\n";
	
	$message = "Contact name: ". $contactname ."\n\nTeam Number: ". $teamnumber ."\n\nSchool Name: ". $schoolname ."\n\nSchool Location: ". $schoollocation ."\n\nTeam Name: ". $teamname ."\n\nContact Email: ". $email ."\n\nTeam Website: ". $teamwebsite ."\n\nNumber of Pre-Rookies: ". $prerookie ."\n\nPre Rookie/other Info: ". $prerookieinfo;
$headers = "From: $email";
mail($to, $subject, $message, $headers);

echo "<h3>Thank You</h3><p>Your registration has been received. Thank you for registering for Brunswick Eruption 11. You will be put on our email list for future updates.</p>";

?>