import {
	DynamoDBClient,
	DynamoDBDocumentClient,
	ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { config } from "dotenv";

config();

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

/**
 * Example of return data:
 *
 * [{
 *		match_time: 1722092400,
 * 		match: 'Leyton Orient',
 * 		type: 'Match',
 * 		venue: 'home'
 * 		url: 'https://tickets.dcfc.co.uk/en-GB/events/derby%20county%20v%20leyton%20orient/2024-4-13_15.00/pride%20park%20stadium?hallmap'
 *	}]
 *
 * @returns {Promise<{match: string, type: string, url: string, match_time: number, venue: string}[]>}
 */
export async function getGames() {
	const command = new ScanCommand({
		TableName: process.env.DYNAMO_TABLE_NAME,
		FilterExpression: "#type = :a",
		ExpressionAttributeNames: {
			"#type": "type",
		},
		ExpressionAttributeValues: {
			":a": "match",
		},
	});

	const games = await dynamo.send(command);
	return games.Items;
}
