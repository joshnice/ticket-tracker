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

const TWEET_TIMES = [10, 13, 19];

export class AwsStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const bucket = new s3.Bucket(this, NAME, {
			bucketName: BUCKET_NAME,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

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

		const lambdaFn = new lambda.Function(this, "Function", {
			runtime: lambda.Runtime.NODEJS_20_X,
			handler: "index.handler",
			code: lambda.Code.fromBucket(bucket, "function.zip"),
			timeout: cdk.Duration.minutes(5),
			memorySize: 512,
			functionName: LAMBDA_NAME,
			environment: {
				TWITTER_APP_KEY,
				TWITTER_APP_SECRET,
				TWITTER_ACCESS_TOKEN,
				TWITTER_ACCESS_SECRET,
				DYNAMO_TABLE_NAME: NAME,
			},
		});

		const table = new dynamodb.TableV2(this, "Table", {
			tableName: DYNAMODB_NAME,
			partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
			tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
			billing: cdk.aws_dynamodb.Billing.provisioned({
				readCapacity: cdk.aws_dynamodb.Capacity.fixed(1),
				writeCapacity: cdk.aws_dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
			}),
		});

		table.grantReadWriteData(lambdaFn);

		TWEET_TIMES.forEach((time) => {
			new events.Rule(this, `${EVENT_NAME}-${time}`, {
				description: `Runs ticket tracker lambda function at ${time}:00 every day`,
				targets: [new eventTargets.LambdaFunction(lambdaFn)],
				schedule: events.Schedule.cron({ hour: time.toString(), minute: "0" }),
			});
		});
	}
}
