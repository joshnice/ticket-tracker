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
	 * @param {{ club: string, amount: number }[]} games
	 */
	tweetUpcomingGames: async (games) => {
		const gamesString = games
			.map((game) => `${game.club}: ${game.amount}`)
			.join("\n");

		await twitterClient.v2.tweet(
			`Number of remaining home tickets left for the following games:\n\n
			${gamesString}\n\n
			#dcfc #dcfcfans 🐏🐏🐏`,
		);
	},
};
