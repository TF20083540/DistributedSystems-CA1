import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv";
import schema from "../shared/types.schema.json";

const ajv = new Ajv();

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
      // Print Event
      console.log("[EVENT]", JSON.stringify(event));
      const body = event.body ? JSON.parse(event.body) : undefined;
      if (!body) {
      return {
        statusCode: 500,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const updateExpression: string[] = []; // Explicitly define the type as string[]
    const expressionAttributeValues: Record<string, any> = {};
    for (const key in body) {
      if (key !== "id") { // Avoid updating the id field itself
        updateExpression.push(`${key} = :${key}`); // This line should now work without issues
        expressionAttributeValues[`:${key}`] = body[key];
      }
    }
    const updateExpressionString = `SET ${updateExpression.join(", ")}`;

  const commandOutput = await ddbDocClient.send(

    new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: body.id }, // Use the same key to update
      UpdateExpression: updateExpressionString,
      ExpressionAttributeValues: expressionAttributeValues,
    })

  );
    return {
      statusCode: 201,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: "Game successfully updated." }),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}