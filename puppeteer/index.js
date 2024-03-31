const { main } = require("./main");
const { getGames } = require("./dynamo");

module.exports = {
	handler: async () => {
		const games = await getGames();
		console.log("games", games);
		await main();
	},
};
