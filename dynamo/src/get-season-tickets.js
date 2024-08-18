import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { config } from "dotenv";

config();

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

/**
 * Example of return data:
 *
 * {
 * 		match: '2024-25',
 * 		type: 'season'
 * 		url: 'https://tickets.dcfc.co.uk/en-GB/events/derby%20county%20v%20leyton%20orient/2024-4-13_15.00/pride%20park%20stadium?hallmap'
 *	}
 *
 * @returns {Promise<{match: string, type: string, url: string}>}
 */
export async function getSeasonTicket() {
	const command = new ScanCommand({
		TableName: process.env.DYNAMO_TABLE_NAME,
		FilterExpression: "#type = :a",
		ExpressionAttributeNames: {
			"#type": "type",
		},
		ExpressionAttributeValues: {
			":a": "season",
		},
	});

	const games = await dynamo.send(command);

	console.log("games", games);

	return games.Items[0];
}
