const { getSeasonTicket } = require("./dynamo");
const { getAmountOfTickets } = require("./main");
const { tweetAmountOfTicketsLeft } = require("./twitter");

module.exports = {
	handler: async () => {
		const seasonTicket = getSeasonTicket();
		const amount = await getAmountOfTickets(seasonTicket.url);
		await tweetAmountOfTicketsLeft(amount);
	},
};
