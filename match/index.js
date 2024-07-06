const { getAmountOfTickets } = require("./main");
const { getGames } = require("./dynamo");
const { tweetAmountOfTicketsLeft } = require("./twitter");

module.exports = {
	handler: async () => {
		const games = await getGames();
		const gamesToPost = [];
		for (const game of games) {
			console.log("game", game.match_time);
			if (new Date(game.match_time * 1000) > new Date()) {
				console.log("game", game.match);
				const amount = await getAmountOfTickets(game.url);
				gamesToPost.push({ name: game.match, amount });
			}
		}

		for (const gamePost of gamesToPost) {
			await tweetAmountOfTicketsLeft(gamePost.name, gamePost.amount);
		}
	},
};
