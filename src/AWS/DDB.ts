import { DynamoDB, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import {
  NativeAttributeValue,
  marshall,
  unmarshall,
} from "@aws-sdk/util-dynamodb";

import { chunk } from "../Array.js";

let DDBInstance: DynamoDB | undefined;

export function DDB() {
  return (DDBInstance ||= new DynamoDB({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: fromEnv(),
  }));
}

export async function DDBGetItem<T>(
  table: string,
  partitionKey: string,
  partitionValue: number | string,
  sortKey?: string,
  sortValue?: number | string,
  projection?: string[],
) {
  const result = await DDB().getItem({
    TableName: table,
    ConsistentRead: false,
    ReturnConsumedCapacity: "TOTAL",
    Key: marshall({
      [partitionKey]: partitionValue,
      ...(sortKey !== undefined && sortValue !== undefined
        ? { [sortKey]: sortValue }
        : {}),
    }),
    ProjectionExpression: projection?.map((name) => `#${name}`).join(", "),
    ExpressionAttributeNames:
      projection === undefined
        ? undefined
        : Object.fromEntries(projection.map((name) => [`#${name}`, name])),
  });

  return result.Item ? (unmarshall(result.Item) as T) : null;
}

export async function DDBUpdateItem(
  table: string,
  partitionKey: string,
  partitionValue: number | string,
  sortKey: string | undefined,
  sortValue: number | string | undefined,
  keys: Record<string, NativeAttributeValue>,
) {
  const attributeNames: Record<string, string> = {};
  const attributeValues: Record<string, NativeAttributeValue> = {};

  const expressionSet: string[] = [];
  const expressionRemove: string[] = [];

  for (const [key, value] of Object.entries(keys)) {
    attributeNames[`#${key}`] = key;

    if (value === undefined) {
      expressionRemove.push(`#${key}`);

      continue;
    }

    attributeValues[`:${key}`] = value as unknown;

    expressionSet.push(`#${key} = :${key}`);
  }

  const updateExpression = [
    expressionSet.length > 0 ? `SET ${expressionSet.join(", ")}` : undefined,
    expressionRemove.length > 0
      ? `REMOVE ${expressionRemove.join(", ")}`
      : undefined,
  ];

  const updateItemParams: UpdateItemCommandInput = {
    TableName: table,
    Key: marshall({
      [partitionKey]: partitionValue,
      ...(sortKey !== undefined && sortValue !== undefined
        ? { [sortKey]: sortValue }
        : {}),
    }),
    UpdateExpression: updateExpression.join(" "),
    ExpressionAttributeNames: attributeNames,
    ExpressionAttributeValues: marshall(attributeValues),
  };

  return DDB().updateItem(updateItemParams);
}

export async function DDBDeleteItem(
  table: string,
  partitionKey: string,
  partitionValue: number | string,
  sortKey: string,
  sortValue: number | string,
) {
  return DDB().deleteItem({
    TableName: table,
    Key: marshall({
      [partitionKey]: partitionValue,
      [sortKey]: sortValue,
    }),
  });
}

export async function DDBBatchWrite(
  table: string,
  entries: object[],
  chunkSize = 25,
) {
  for (const chunkEntries of chunk(entries, chunkSize)) {
    await DDB().batchWriteItem({
      RequestItems: {
        [table]: chunkEntries.map((entry) => ({
          PutRequest: { Item: marshall(entry) },
        })),
      },
    });
  }
}
