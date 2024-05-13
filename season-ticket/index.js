const { getSeasonTicket } = require("./dynamo");
const { getAmountOfTickets } = require("./main");
const { tweetAmountOfTicketsLeft } = require("./twitter");

module.exports = {
	handler: async () => {
		const seasonTicket = await getSeasonTicket();
		const amount = await getAmountOfTickets(seasonTicket.url);
		await tweetAmountOfTicketsLeft(amount);
	},
};
