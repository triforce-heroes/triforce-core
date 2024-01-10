import { QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { DDB } from "./DDB.js";

type QueryOperation =
  | ["<" | "<=" | ">" | ">=", number]
  | ["=", number | string]
  | ["BEGINS_WITH", string]
  | ["BETWEEN", number, number]
  | [];

export class DDBQueryBuilder<T> {
  private readonly options: Partial<QueryCommandInput> = {};

  private namesIndex = 0;

  private readonly projections: string[] = [];

  private readonly attributeNames: Record<string, string> = {};

  private readonly attributeValues: Record<string, number | string> = {};

  private readonly keyConditionExpressions: string[] = [];

  public constructor(
    private readonly tableName: string,
    partitionKey: string,
    partitionValue: number | string,
    additionalOptions?: QueryCommandInput,
  ) {
    Object.assign(this.options, additionalOptions);

    this.pushKeyConditionExpression(partitionKey, "=", partitionValue);
  }

  public pushProjections(...projections: string[]) {
    this.projections.push(
      ...projections.map((name) => this.newAttributeName(name)),
    );
  }

  public usingIndex(
    indexName: string,
    sortKey?: string,
    ...args: QueryOperation
  ) {
    this.options.IndexName = indexName;

    if (sortKey !== undefined) {
      this.pushKeyConditionExpression(sortKey, ...args);
    }
  }

  public async get() {
    const results: T[] = [];

    const query: QueryCommandInput = {
      ...this.options,
      TableName: this.tableName,
      KeyConditionExpression: this.keyConditionExpressions.join(" AND "),
      ProjectionExpression: this.projections.join(","),
      ExpressionAttributeNames: this.attributeNames,
      ExpressionAttributeValues: marshall(this.attributeValues),
    };

    while (true) {
      const result = await DDB().query(query);

      results.push(...result.Items!.map((item) => unmarshall(item) as T));

      if (result.LastEvaluatedKey) {
        query.ExclusiveStartKey = result.LastEvaluatedKey;
        continue;
      }

      break;
    }

    return results;
  }

  private newAttributeName(value: string) {
    const name = `#${this.namesIndex++}`;

    this.attributeNames[name] = value;

    return name;
  }

  private newAttributeValue(value: number | string) {
    const name = `:${this.namesIndex++}`;

    this.attributeValues[name] = value;

    return name;
  }

  private pushKeyConditionExpression(key: string, ...args: QueryOperation) {
    const keyName = this.newAttributeName(key);

    if (args[0] === "BETWEEN") {
      const value1 = this.newAttributeValue(args[1]);
      const value2 = this.newAttributeValue(args[2]);

      this.keyConditionExpressions.push(
        `${keyName} BETWEEN ${value1} AND ${value2}`,
      );
    } else if (args[0] === "BEGINS_WITH") {
      const value = this.newAttributeValue(args[1]);

      this.keyConditionExpressions.push(`begins_with(${keyName},${value})`);
    } else {
      const value = this.newAttributeValue(args[1]!);

      this.keyConditionExpressions.push(`${keyName}${args[0]}${value}`);
    }
  }
}
