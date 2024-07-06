import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import {
	aws_s3 as s3,
	aws_lambda as lambda,
	aws_dynamodb as dynamodb,
	aws_events as events,
	aws_events_targets as eventTargets,
} from "aws-cdk-lib";
import "dotenv/config";

const NAME = "ticket-tracker";
const BUCKET_NAME = `${NAME}-lambda-code-bucket`;
const LAMBDA_NAME = NAME;
const DYNAMODB_NAME = NAME;
const EVENT_NAME = `${NAME}-events`;

const MATCH_TWEET_TIMES = [18];

const SEASON_TICKET_TWEET_TIMES = [17];

export class AwsStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const matchDayTicketsBucket = new s3.Bucket(
			this,
			`${BUCKET_NAME}-match-tickets`,
			{
				bucketName: `${BUCKET_NAME}-match-tickets`,
				removalPolicy: cdk.RemovalPolicy.DESTROY,
			},
		);

		const seasonTicketBucket = new s3.Bucket(
			this,
			`${BUCKET_NAME}-season-tickets`,
			{
				bucketName: `${BUCKET_NAME}-season-tickets`,
				removalPolicy: cdk.RemovalPolicy.DESTROY,
			},
		);

		const {
			TWITTER_APP_KEY,
			TWITTER_APP_SECRET,
			TWITTER_ACCESS_TOKEN,
			TWITTER_ACCESS_SECRET,
		} = process.env;
		if (
			TWITTER_APP_KEY == null ||
			TWITTER_APP_SECRET == null ||
			TWITTER_ACCESS_TOKEN == null ||
			TWITTER_ACCESS_SECRET == null
		) {
			throw new Error("Environment variables not set up correctly");
		}

		const matchTicketsLambdaFunction = new lambda.Function(
			this,
			`match-${LAMBDA_NAME}`,
			{
				runtime: lambda.Runtime.NODEJS_20_X,
				handler: "index.handler",
				code: lambda.Code.fromBucket(matchDayTicketsBucket, "function.zip"),
				timeout: cdk.Duration.minutes(5),
				memorySize: 512,
				functionName: `match-${LAMBDA_NAME}`,
				environment: {
					TWITTER_APP_KEY,
					TWITTER_APP_SECRET,
					TWITTER_ACCESS_TOKEN,
					TWITTER_ACCESS_SECRET,
					DYNAMO_TABLE_NAME: NAME,
				},
			},
		);

		const seasonTicketsLambdaFunction = new lambda.Function(
			this,
			`season-${LAMBDA_NAME}`,
			{
				runtime: lambda.Runtime.NODEJS_20_X,
				handler: "index.handler",
				code: lambda.Code.fromBucket(seasonTicketBucket, "function.zip"),
				timeout: cdk.Duration.minutes(5),
				memorySize: 512,
				functionName: `season-${LAMBDA_NAME}`,
				environment: {
					TWITTER_APP_KEY,
					TWITTER_APP_SECRET,
					TWITTER_ACCESS_TOKEN,
					TWITTER_ACCESS_SECRET,
					DYNAMO_TABLE_NAME: NAME,
				},
			},
		);

		const table = new dynamodb.TableV2(this, DYNAMODB_NAME, {
			tableName: DYNAMODB_NAME,
			partitionKey: { name: "match", type: dynamodb.AttributeType.STRING },
			sortKey: { name: "type", type: dynamodb.AttributeType.STRING },
			tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
			billing: cdk.aws_dynamodb.Billing.onDemand(),
		});

		table.grantReadWriteData(matchTicketsLambdaFunction);
		table.grantReadWriteData(seasonTicketsLambdaFunction);

		MATCH_TWEET_TIMES.forEach((time) => {
			new events.Rule(this, `${EVENT_NAME}-${time}`, {
				description: `Runs match ticket tracker lambda function at ${time}:00 every day`,
				targets: [new eventTargets.LambdaFunction(matchTicketsLambdaFunction)],
				schedule: events.Schedule.cron({ hour: time.toString(), minute: "0" }),
			});
		});

		SEASON_TICKET_TWEET_TIMES.forEach((time) => {
			new events.Rule(this, `${EVENT_NAME}-${time}`, {
				description: `Runs season ticket tracker lambda function at ${time}:00 every day`,
				targets: [new eventTargets.LambdaFunction(seasonTicketsLambdaFunction)],
				schedule: events.Schedule.cron({ hour: time.toString(), minute: "0" }),
			});
		});
	}
}
