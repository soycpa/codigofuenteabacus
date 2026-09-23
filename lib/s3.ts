import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client, getBucketConfig } from "./aws-config";

const region = process.env.AWS_REGION ?? "us-west-2";

export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  isPublic = false
): Promise<{ uploadUrl: string; cloud_storage_path: string }> {
  const { bucketName, folderPrefix } = getBucketConfig();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const cloud_storage_path = isPublic
    ? `${folderPrefix}public/uploads/${Date.now()}-${safeName}`
    : `${folderPrefix}uploads/${Date.now()}-${safeName}`;

  const client = createS3Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: cloud_storage_path,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  return { uploadUrl, cloud_storage_path };
}

export async function getFileUrl(cloud_storage_path: string, isPublic: boolean): Promise<string> {
  const { bucketName } = getBucketConfig();
  if (isPublic) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${cloud_storage_path}`;
  }
  const client = createS3Client();
  const command = new GetObjectCommand({ Bucket: bucketName, Key: cloud_storage_path });
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function deleteFile(cloud_storage_path: string): Promise<void> {
  const { bucketName } = getBucketConfig();
  const client = createS3Client();
  await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: cloud_storage_path }));
}

/** Extract S3 key from a full public URL, or return as-is if already a key */
export function extractS3Key(urlOrKey: string): string | null {
  if (!urlOrKey) return null;
  try {
    const u = new URL(urlOrKey);
    // https://BUCKET.s3.REGION.amazonaws.com/KEY
    if (u.hostname.includes(".s3.") && u.hostname.endsWith(".amazonaws.com")) {
      return decodeURIComponent(u.pathname.slice(1)); // remove leading /
    }
  } catch {
    // Not a URL – may already be a key
  }
  return urlOrKey.startsWith("http") ? null : urlOrKey;
}

/** Delete all S3 media files referenced in a funnel config object */
export async function deleteAllFunnelMedia(config: Record<string, any>): Promise<number> {
  const { bucketName } = getBucketConfig();
  const client = createS3Client();
  let deleted = 0;

  for (const [key, value] of Object.entries(config)) {
    if (typeof value !== "string" || !value) continue;
    if (!(key.endsWith("VideoUrl") || key === "logoUrl" || key.endsWith("ImageUrl"))) continue;
    const s3Key = extractS3Key(value);
    if (!s3Key) continue;
    try {
      await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));
      deleted++;
    } catch (err) {
      console.error(`Failed to delete S3 key ${s3Key}:`, err);
    }
  }
  return deleted;
}

// For server-side direct upload (used in seed script)
import { readFileSync } from "fs";
export async function uploadFileFromPath(
  filePath: string,
  fileName: string,
  contentType: string
): Promise<string> {
  const { bucketName, folderPrefix } = getBucketConfig();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const cloud_storage_path = `${folderPrefix}public/uploads/${Date.now()}-${safeName}`;
  const client = createS3Client();
  const body = readFileSync(filePath);
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: cloud_storage_path,
      Body: body,
      ContentType: contentType,
    })
  );
  return `https://${bucketName}.s3.${region}.amazonaws.com/${cloud_storage_path}`;
}
