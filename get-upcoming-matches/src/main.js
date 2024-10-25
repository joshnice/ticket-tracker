import { getGames, } from "@ticket-tracker/dynamo";
import { getUpcomngMatches } from "@ticket-tracker/match-getter";

export async function handler() {
	const matches = await getUpcomngMatches();
	console.log("matches", matches);
	const matchesInDb = await getGames();
	const matchesToAdd = [];
	matches.forEach((match) => {
		if (!matchesInDb.some((m) => m.match === match.name)) {
			matchesToAdd.push(match);
		}
	});

}
