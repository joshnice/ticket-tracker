import { getUpcomngMatches } from "@ticket-tracker/match-getter";
import { writeFile } from "node:fs/promises";

async function main() {
	const { screenshot, matches } = await getUpcomngMatches();
	console.log("matches", matches);
	if (screenshot) {
		const buffer = Buffer.from(screenshot, "base64");
		await writeFile("output.png", buffer);
	}
}

main();
