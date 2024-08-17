import { getGames } from "@ticket-tracker/dyanmo";
import { getAmountOfTickets } from "@ticket-tracker/get-tickets";
import { postTweet } from "@ticket-tracker/twitter";

export async function handler() {
	const games = await getGames();

	const [nextGame] = games
		.filter((game) => new Date(game.match_time * 1000) > new Date())
		.sort((gameA, gameB) => gameA.match_time - gameB.match_time);

	const amount = await getAmountOfTickets(nextGame.url);

	const tweet = `Number of remaining ${nextGame.venue} tickets left for the ${nextGame.match} game is ${amount} \n\n#dcfc #dcfcfans 🐏🐏🐏`;
	await postTweet(tweet);
}
