import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import {
	aws_s3 as s3,
	aws_lambda as lambda,
	aws_dynamodb as dynamodb,
} from "aws-cdk-lib";

const NAME = "ticket-tracker";
const BUCKET_NAME = `${NAME}-lambda-code-bucket`;
const LAMBDA_NAME = NAME;
const DYNAMODB_NAME = NAME;

export class AwsStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const bucket = new s3.Bucket(this, NAME, {
			bucketName: BUCKET_NAME,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		new lambda.Function(this, "Function", {
			runtime: lambda.Runtime.NODEJS_20_X,
			handler: "index.handler",
			code: lambda.Code.fromBucket(bucket, "function.zip"),
			timeout: cdk.Duration.minutes(5),
			memorySize: 512,
			functionName: LAMBDA_NAME,
		});

		new dynamodb.TableV2(this, "Table", {
			tableName: DYNAMODB_NAME,
			partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
			tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
			billing: cdk.aws_dynamodb.Billing.provisioned({
				readCapacity: cdk.aws_dynamodb.Capacity.fixed(1),
				writeCapacity: cdk.aws_dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
			}),
		});
	}
}
