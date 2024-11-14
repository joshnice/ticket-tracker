import { getGames } from "@ticket-tracker/dynamo";
import { getAmountOfTickets } from "@ticket-tracker/get-tickets";
import { postTweet } from "@ticket-tracker/twitter";

export async function handler() {
	const games = await getGames();
	const [_, ...upcomingGames] = games
		.filter((game) => new Date(game.match_time * 1000) > new Date())
		.sort((a, b) => a.match_time - b.match_time);

	const gamesToPost = [];

	if (upcomingGames.length > 0) {

		for (const game of upcomingGames) {
			const response = await getAmountOfTickets(game.url);
			if (response != null) {
				gamesToPost.push({ club: game.match, amount: totalAmount });
			}
		}

		if (gamesToPost.length === 0) {
			return;
		}

		const gamesString = gamesToPost
			.map((game) => `${game.club} - ${game.amount}`)
			.join("\n");

		const tweet = `Number of remaining home tickets left for the next ${upcomingGames.length} games\n\n
			${gamesString}\n\n
			#dcfc #dcfcfans 🐏🐏🐏`;

		await postTweet(tweet);
	}
}
