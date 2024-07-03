import { S3Client } from "@/utils/s3";

export const onRequest: PagesFunction<{
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  CF_ACCOUNT_ID: string;
}> = async function (context) {
  const { request, env } = context;

  const client = new S3Client(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY);
  const forwardUrl = request.url.replace(
    /.*\/api\/write\/s3\//,
    `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/`
  );

  return client.s3_fetch(forwardUrl, {
    method: request.method,
    body: request.body,
    headers: request.headers,
  });
};
