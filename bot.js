
/* Configure the Twitter API */
var TWITTER_CONSUMER_KEY = 'xxxxxxxxxxxxxxxx';
var TWITTER_CONSUMER_SECRET = 'xxxxxxxxxxxxxxxx';
var TWITTER_ACCESS_TOKEN = 'xxxxxxxxxxxxxxxx';
var TWITTER_ACCESS_TOKEN_SECRET = 'xxxxxxxxxxxxxxxx';


var Twit = require('twit');
var https = require('https');



var T = new Twit({
	consumer_key: TWITTER_CONSUMER_KEY,
	consumer_secret: TWITTER_CONSUMER_SECRET,
	access_token: TWITTER_ACCESS_TOKEN,
	access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

console.log('The bot is running...');

/* BotInit() : To initiate the bot */
function BotInit() {
	T.post('statuses/update', { status: "I was Forged by @sathish4vy. I'm made with some @NodeJS & lots of ❤️. I tweet an adorable photo every now and then😉." }, BotInitiated);

	function BotInitiated (error, data, response) {
		if (error) {
			console.log('Bot could not be initiated, : ' + error);
		}
		else {
  			console.log('Bot initiated!');
		}
	}

	BotTweet();
}

/* BotTweet() : To retweet the matching recent tweet */
function BotTweet() {
	var request = require('request').defaults({ encoding: null });

	request.get('https://source.unsplash.com/random/440x220', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
			// console.log(data);
					// first we must post the media to Twitter
				T.post('media/upload', { media_data: new Buffer(body).toString('base64') }, function (err, data, response) {
					// now we can assign alt text to the media, for use by screen readers and
					// other text-based presentations and interpreters
					var mediaIdStr = data.media_id_string
					var altText = "Small flowers in a planter on a sunny balcony, blossoming."
					var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

					T.post('media/metadata/create', meta_params, function (err, data, response) {
					if (!err) {
						// now we can reference the media and post a tweet (media will attach to the tweet)
						var params = { status: 'Have your dosage of an awesome photo. 💜 #photography #art', media_ids: [mediaIdStr] }

						T.post('statuses/update', params, function (err, data, response) {
						console.log('Tweeted an adorable photo')
						})
					}
					})
				})
		}
	});

	favoriteTweet();

}

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){
	var items = ['#photography', '#art', '#travel', '#nature', '#wildlife', '#wildlifephotography'];
	var params = {
		q: items[Math.floor(Math.random()*items.length)],  // REQUIRED
		result_type: 'recent',
		lang: 'en',
		// count: 10
	}
	// for more parametes, see: https://dev.twitter.com/rest/reference

	// find the tweet
	T.get('search/tweets', params, function(err,data){

	  // find tweets
	  var tweet = data.statuses;
		var randomTweet = undefined;
		tweet ? (randomTweet = ranDom(tweet)) : console.log('Not running fav function.');   // pick a random tweet

	  // if random tweet exists
	  if(typeof randomTweet != 'undefined'){
		// Tell TWITTER to 'favorite'
		T.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
		  // if there was an error while 'favorite'
		  if(err){
			console.log('CANNOT BE FAVORITE... Error');
		  }
		  else{
			console.log('FAVORITED... Success!!!');
		  }
		});
	  }
	});
  }
  // grab & 'favorite' as soon as program is running...
  favoriteTweet();
  // 'favorite' a tweet in every 60 minutes
  // setInterval(favoriteTweet, 30*60*1000);

  // function to generate a random tweet tweet
  function ranDom (arr) {
	var index = Math.floor(Math.random()*arr.length);
	return arr[index];
  };

/* Set an interval of 30 minutes (in microsecondes) */
setInterval(BotTweet, 60*60*1000);

/* Initiate the Bot */
BotInit();