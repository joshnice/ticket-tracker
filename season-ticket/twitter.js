const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

const twitterClient = new TwitterApi({
	appKey: process.env.TWITTER_APP_KEY,
	appSecret: process.env.TWITTER_APP_SECRET,
	accessToken: process.env.TWITTER_ACCESS_TOKEN,
	accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

module.exports = {
	/**
	 * @param {number} amount
	 */
	tweetAmountOfTicketsLeft: async (amount) => {
		await twitterClient.v2.tweet(
			`Number of available seasons tickets left is ${amount} \n\n#dcfc #dcfcfans 🐏🐏🐏`,
		);
	},
};
