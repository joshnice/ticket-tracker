import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import { aws_s3 as s3, aws_lambda as lambda } from "aws-cdk-lib";

const NAME = "ticket-tracker";

export class AwsStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const bucket = new s3.Bucket(this, NAME, {
			bucketName: `${NAME}-lambda-code-bucket`,
		});

		new lambda.Function(this, "Function", {
			runtime: lambda.Runtime.NODEJS_16_X,
			handler: "index.handler",
			code: lambda.Code.fromBucket(bucket, "function"),
			timeout: cdk.Duration.seconds(30),
			memorySize: 512,
			functionName: NAME,
		});
	}
}
