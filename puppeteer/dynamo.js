const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
	DynamoDBDocumentClient,
	ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "ticket-tracker";

module.exports = {
	getGames: async () => {
		const games = await dynamo.send(new ScanCommand({ TableName: TABLE_NAME }));
		console.log("games", games);
		return games;
	},
};
