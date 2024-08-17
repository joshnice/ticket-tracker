const { getAmountOfTickets } = require("./puppeteer.js");
const fs = require("node:fs/promises");

async function main() {
	const url =
		"https://tickets.dcfc.co.uk/en-GB/events/derby%20county%20v%20middlesbrough/2024-8-17_12.30/pride%20park%20stadium?hallmap";

	const { screenshot, result } = await getAmountOfTickets(url);

	const buffer = Buffer.from(screenshot, "base64");
	await fs.writeFile("output.png", buffer);

	console.log(result);
}

main();
