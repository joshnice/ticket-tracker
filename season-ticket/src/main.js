import { getSeasonTicket } from "@ticket-tracker/dynamo";
import { getAmountOfTickets } from "@ticket-tracker/get-tickets";
import { postTweet } from "@ticket-tracker/twitter";

export async function handler() {
	const seasonTicket = await getSeasonTicket();

	const { totalAmount } = await getAmountOfTickets(seasonTicket.url);

	const tweet = `Number of available seasons tickets left is ${totalAmount} \n\n#dcfc #dcfcfans 🐏🐏🐏`;

	await postTweet(tweet);
}
