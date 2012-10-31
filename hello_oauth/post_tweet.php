<?php
/**
* post_tweet.php
* Example of posting a tweet with OAuth
* Latest copy of this code: 
* http://140dev.com/twitter-api-programming-tutorials/hello-twitter-oauth-php/
* @author Adam Green <140dev@gmail.com>
* @license GNU Public License
*/
$tweet_text = $_POST['tweetText'];
$result = post_tweet($tweet_text);
echo "Response code: " . $result;

function post_tweet($tweet_text) {

  // Use Matt Harris' OAuth library to make the connection
  // This lives at: https://github.com/themattharris/tmhOAuth
  require_once('tmhoauth/tmhOAuth.php');
      
  // Set the authorization values
  // In keeping with the OAuth tradition of maximum confusion, 
  // the names of some of these values are different from the Twitter Dev interface
  // user_token is called Access Token on the Dev site
  // user_secret is called Access Token Secret on the Dev site
  // The values here have asterisks to hide the true contents 
  // You need to use the actual values from your Twitter app
  $connection = new tmhOAuth(array(
    'consumer_key' => 'JPjchzFZovDIRNz9GUJfzw',
    'consumer_secret' => 'wCYXp1n0pIm9BdmM5ZhZ1OaY9Nray25hyYLGuwMU',
    'user_token' => '361038359-u5gkxVl0UHI4hC3nesl2CTMLECZQSpBdn9XOlDxW',
    'user_secret' => '2chDV7sV5jDI9BDqXnKdyAl8igBorOypHi35vFB4GE',
  )); 
  
  // Make the API call
  $connection->request('POST', 
    $connection->url('1/statuses/update'), 
    array('status' => $tweet_text));
  
  return $connection->response['code'];
}
?>