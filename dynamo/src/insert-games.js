import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { config } from "dotenv";

config();

const client = new DynamoDBClient({});

/**
 * @param {{ match: string, matchTime: number, url: string }[]} games 
 */
export async function insertGame(games) {
    const input = {
        RequestItems: {
            [process.env.DYNAMO_TABLE_NAME]: games.map((game) => {
                return ({
                    PutRequest: {
                        Item: {
                            match: {
                                S: game.match
                            },
                            match_time: {
                                N: game.matchTime
                            },
                            url: {
                                S: game.url
                            }
                        }
                    }
                });
            })
        }
    };

    const command = new BatchWriteItemCommand(input);
    await client.send(command);
}
