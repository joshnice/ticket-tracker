import { getGames } from "@ticket-tracker/dynamo";
import { getAmountOfTickets } from "@ticket-tracker/get-tickets";
import { postTweet } from "@ticket-tracker/twitter";

export async function handler() {
	const games = await getGames();
	const [_, ...upcomingGames] = games
		.filter((game) => new Date(game.match_time * 1000) > new Date())
		.sort((a, b) => a.match_time - b.match_time);

	const gamesToPost = [];

	for (const game of upcomingGames) {
		const amount = await getAmountOfTickets(game.url);
		gamesToPost.push({ club: game.match, amount });
	}

	const gamesString = gamesToPost
		.map((game) => `${game.club} - ${game.amount}`)
		.join("\n");

	const tweet = `Number of remaining home tickets left for the next ${games.length} games\n\n
			${gamesString}\n\n
			#dcfc #dcfcfans 🐏🐏🐏`;

	await postTweet(tweet);
}