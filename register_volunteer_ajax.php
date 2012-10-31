<?php
$name = $_POST['name'];
$teamnum = $_POST['teamnum'];
$volunteeras = $_POST['volunteeras'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$size = $_POST['size'];
$volunteerinfo = $_POST['volunteerinfo'];

//debug info
//echo $name ."<br>". $teamnum ."<br>". $volunteeras ."<br>". $email ."<br>". $phone ."<br>". $volunteerinfo;




$to      = "bharatnain@gmail.com, smwonder@comcast.net, kristian.calhoun@gmail.com, offseasonmanager@gmail.com, libby.kamen@gmail.com";
$subject = $name ." would like to volunteer at Brunswick Eruption 11";

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
contains_bad_str($name);
contains_bad_str($teamnum);
contains_bad_str($volunteeras);
contains_bad_str($phone);
contains_bad_str($volunteerinfo);

contains_newlines($email);
contains_newlines($name);
contains_newlines($teamnum);
contains_newlines($volunteeras);
contains_newlines($phone);
contains_newlines($volunteerinfo);


//code to formulate email since spam and abuse check is done
	$header = "MIME-Version: 1.0 \r\n";
	$header .= "Content-type: text/html; charset=iso-8859-1\r\n";
	$header .= "To: ". $to ."\r\n";
	$header .= "From: ". $email ." <". $to .">\r\n";
	
	$message = "Volunteer Name: ". $name ."\n\nTeam Number: ". $teamnum ."\n\nVolunteer As: ". $volunteeras ."\n\nVolunteer Email: ". $email ."\n\nPhone: ". $phone ."\n\nShirt Size: ". $size ."\n\nVolunteer Experience\n: ". $volunteerinfo;

mail($to, $subject, $message, $headers);

echo "<h3>Thank You</h3><p>Your registration has been received. Thank you for volunteering at Brunswick Eruption 11. You will be contacted as the event gets closer.</p>";


?>