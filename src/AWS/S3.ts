import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";

let S3Instance: S3Client | undefined;

export function S3() {
  return (S3Instance ||= new S3Client({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: fromEnv(),
  }));
}

export async function S3GetObject(path: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: path,
  });

  const stream = (await S3().send(command)).Body!;

  return Buffer.from((await stream.transformToByteArray()).buffer);
}
