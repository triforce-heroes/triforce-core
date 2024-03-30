import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
export declare function DDB(): DynamoDB;
export declare function DDBGetItem<T>(table: string, partitionKey: string, partitionValue: number | string, sortKey?: string, sortValue?: number | string, projection?: string[]): Promise<T | null>;
export declare function DDBUpdateItem(table: string, partitionKey: string, partitionValue: number | string, sortKey: string | undefined, sortValue: number | string | undefined, keys: Record<string, NativeAttributeValue>): Promise<import("@aws-sdk/client-dynamodb").UpdateItemCommandOutput>;
export declare function DDBDeleteItem(table: string, partitionKey: string, partitionValue: number | string, sortKey: string, sortValue: number | string): Promise<import("@aws-sdk/client-dynamodb").DeleteItemCommandOutput>;
export declare function DDBBatchWrite(table: string, entries: object[], chunkSize?: number): Promise<void>;
export declare function DDBBatchDelete(table: string, entries: object[], chunkSize?: number): Promise<void>;
