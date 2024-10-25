import { getGames, insertGames } from "@ticket-tracker/dynamo";
import { getUpcomngMatches } from "@ticket-tracker/match-getter";

export async function handler() {
	const matches = await getUpcomngMatches();
	const matchesInDb = await getGames();
	const matchesToAdd = [];
	matches.forEach((match) => {
		if (!matchesInDb.some((m) => m.match === match.name)) {
			matchesToAdd.push(({ match: match.name, matchTime: match.date, url: match.url }));
		}
	});
	console.log("matches to add", matchesToAdd);
	insertGames(matchesToAdd);
}
