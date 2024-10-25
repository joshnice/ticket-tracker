import { getGames, insertGames } from "@ticket-tracker/dynamo";
import { getUpcomingMatches } from "@ticket-tracker/match-getter";

export async function handler() {
	const matches = await getUpcomingMatches();
	const matchesInDb = await getGames();
	const matchesToAdd = [];
	matches.forEach((match) => {
		if (!matchesInDb.some((m) => m.match === match.name)) {
			matchesToAdd.push(({ match: match.name, matchTime: match.date, url: match.url }));
		}
	});
	await insertGames(matchesToAdd);
}
