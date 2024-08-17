import { getGames } from "./dynamo.js";
import { getAmountOfTickets } from "@ticket-tracker/get-tickets";
import { tweetAmountOfTicketsLeft } from "./twitter.js";

export async function handler() {
	const games = await getGames();

	const [nextGame] = games
		.filter((game) => new Date(game.match_time * 1000) > new Date())
		.sort((gameA, gameB) => gameA.match_time - gameB.match_time);

	const amount = await getAmountOfTickets(nextGame.url);

	await tweetAmountOfTicketsLeft(nextGame.match, amount, nextGame.venue);
}
