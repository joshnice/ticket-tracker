import { TwitterApi } from "twitter-api-v2";
import { config } from "dotenv";

config();

const twitterClient = new TwitterApi({
	appKey: process.env.TWITTER_APP_KEY,
	appSecret: process.env.TWITTER_APP_SECRET,
	accessToken: process.env.TWITTER_ACCESS_TOKEN,
	accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

/**
 * @param {string} tweetText
 */
export async function postTweet(tweetText) {
	await twitterClient.v2.tweet(tweetText);
}
