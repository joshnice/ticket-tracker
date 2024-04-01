const { getAmountOfTickets } = require("./main");
const { getGames } = require("./dynamo");

module.exports = {
	handler: async () => {
		const games = await getGames();
		const gamesToPost = [];
		console.log("games", games);
		for (const game of games) {
			if (new Date(game.match_time) < new Date()) {
				const amount = await getAmountOfTickets(game.url);
				gamesToPost.push({ name: game.pk, amount });
			}
		}
		console.log("gamesToPost", gamesToPost);
	},
};
