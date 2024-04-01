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
	 * @param {string} club
	 * @param {number} amount
	 */
	tweetAmountOfTicketsLeft: async (club, amount) => {
		await twitterClient.v2.tweet(
			`Number of remaining home tickets left for the ${club} game is ${amount} \n\n#dcfc #dcfcfans 🐏🐏🐏`,
		);
	},
};
