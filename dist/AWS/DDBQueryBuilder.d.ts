import type { QueryCommandInput } from "@aws-sdk/client-dynamodb";
type QueryOperation = ["<" | "<=" | ">" | ">=", number] | ["=", number | string] | ["BEGINS_WITH", string] | ["BETWEEN", number, number] | [];
export declare class DDBQueryBuilder<T> {
    private readonly tableName;
    private readonly options;
    private namesIndex;
    private readonly projections;
    private readonly attributeNames;
    private readonly attributeValues;
    private readonly keyConditionExpressions;
    constructor(tableName: string, partitionKey: string, partitionValue: number | string, additionalOptions?: QueryCommandInput);
    pushProjections(...projections: string[]): void;
    usingIndex(indexName: string, sortKey?: string, ...args: QueryOperation): void;
    get(): Promise<T[]>;
    private newAttributeName;
    private newAttributeValue;
    private pushKeyConditionExpression;
}
export {};
