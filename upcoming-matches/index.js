const { getAmountOfTickets } = require("./main");
const { getGames } = require("./dynamo");
const { tweetUpcomingGames } = require("./twitter");

module.exports = {
	handler: async () => {
		const games = await getGames();
		const [_, ...upcomingGames] = games
			.filter((game) => new Date(game.match_time * 1000) > new Date())
			.sort((a, b) => a.match_time - b.match_time);

		const gamesToPost = [];
		for (const game of upcomingGames) {
			const amount = await getAmountOfTickets(game.url);
			gamesToPost.push({ club: game.match, amount });
		}

		// await tweetUpcomingGames(gamesToPost);
	},
};
