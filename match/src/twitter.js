import { postTweet } from "@ticket-tracker/twitter";

/**
 * @param {string} club
 * @param {number} amount
 * @param {"home" | "away"} venue
 */
export async function createTweetTextForMatchTicketes(
	club,
	amount,
	venue = "home",
) {
	const tweet = `Number of remaining ${venue} tickets left for the ${club} game is ${amount} \n\n#dcfc #dcfcfans 🐏🐏🐏`;
	await postTweet(tweet);
}
