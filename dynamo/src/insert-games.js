import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { config } from "dotenv";

config();

const client = new DynamoDBClient({});

/**
 * @param {{ match: string, matchTime: number, url: string }[]} games 
 */
export async function insertGames(games) {
    const input = {
        RequestItems: {
            [process.env.DYNAMO_TABLE_NAME]: games.map((game) => {
                return ({
                    PutRequest: {
                        Item: {
                            match: { S: game.match },
                            type: { S: "Match" },
                            match_time: { N: game.matchTime.toString() },
                            url: { S: game.url }
                        }
                    }
                });
            })
        }
    };

    const command = new BatchWriteItemCommand(input);
    await client.send(command);
}
