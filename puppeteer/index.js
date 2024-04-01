const { getAmountOfTickets } = require("./main");
const { getGames } = require("./dynamo");

module.exports = {
	handler: async () => {
		const games = await getGames();
		console.log("games", games);
		for (const game of games) {
			const amount = await getAmountOfTickets(game.url);
			game.amount = amount;
		}
		console.log("games", games);
	},
};
