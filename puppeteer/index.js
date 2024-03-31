const { main } = require("./main");
const { getGames } = require("./dynamo");

module.exports = {
	handler: async () => {
		const games = await getGames();
		await main();
	},
};
