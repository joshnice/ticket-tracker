#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TicketTracker } from "../lib/ticket-tracker";

const app = new cdk.App();
new TicketTracker(app, "dcfc-ticket-tracker", {});