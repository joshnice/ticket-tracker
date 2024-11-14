import { getGames } from "@ticket-tracker/dynamo";
import { getAmountOfTickets } from "@ticket-tracker/get-tickets";
import { postTweet } from "@ticket-tracker/twitter";

export async function handler() {
	const games = await getGames();

	const [nextGame] = games
		.filter((game) => new Date(game.match_time * 1000) > new Date())
		.sort((gameA, gameB) => gameA.match_time - gameB.match_time);

	const response = await getAmountOfTickets(nextGame.url);

	if (response == null) {
		return;
	}

	const totalAmount = { response };

	const venue = nextGame.venue ?? "home";

	const tweet = `Number of remaining ${venue} tickets left for the ${nextGame.match} game is ${totalAmount} \n\n#dcfc #dcfcfans 🐏🐏🐏`;
	await postTweet(tweet);
}
