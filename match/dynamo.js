const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
	DynamoDBDocumentClient,
	ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

module.exports = {
	/**
	 * Example of return data:
	 *
	 * [{
	 *		match_time: '13-04-2024-15-00',
	 * 		pk: 'Leyton Orient',
	 * 		url: 'https://tickets.dcfc.co.uk/en-GB/events/derby%20county%20v%20leyton%20orient/2024-4-13_15.00/pride%20park%20stadium?hallmap'
	 *	}]
	 *
	 * @returns {Promise<{pk: string, url: string, match_time: string}[]>}
	 */
	getGames: async () => {
		const games = await dynamo.send(
			new ScanCommand({ TableName: process.env.DYNAMO_TABLE_NAME }),
		);
		return games.Items;
	},
};
