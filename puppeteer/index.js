const { main } = require("./main");

module.exports = {
	handler: async () => {
		await main();
	},
};
