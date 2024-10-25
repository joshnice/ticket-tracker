import { getUpcomingMatches } from "@ticket-tracker/match-getter";

async function main() {
	const matches = await getUpcomingMatches();
	console.log("matches", matches);
	// if (screenshot) {
	// 	const buffer = Buffer.from(screenshot, "base64");
	// 	await writeFile("output.png", buffer);
	// }
}

main();
