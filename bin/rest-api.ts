#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { GameAPIStack } from "../lib/game-api-stack";


const app = new cdk.App();
new GameAPIStack(app, "GameAPIStack", { env: { region: "eu-west-1" } });
