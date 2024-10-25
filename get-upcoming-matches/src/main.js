import { getGames, insertGames } from "@ticket-tracker/dynamo";
import { getUpcomingMatches } from "@ticket-tracker/match-getter";

export async function handler() {
	console.log("start");
	const matches = await getUpcomingMatches();
	console.log("matches", matches);
	const matchesInDb = await getGames();
	console.log("matchesInDb", matchesInDb);
	const matchesToAdd = [];
	matches.forEach((match) => {
		if (!matchesInDb.some((m) => m.match === match.name)) {
			matchesToAdd.push(({ match: match.name, matchTime: match.date, url: match.url }));
		}
	});
	console.log("matches to add", matchesToAdd);
	insertGames(matchesToAdd);
}
