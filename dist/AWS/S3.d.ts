/// <reference types="node" resolution-mode="require"/>
import { S3Client } from "@aws-sdk/client-s3";
export declare function S3(): S3Client;
export declare function S3GetObject(path: string): Promise<Buffer>;
