import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

const allowedContentTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const maxImageSize = 8 * 1024 * 1024;

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const token = process.env.BLOB_READ_WRITE_TOKEN
      || process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN
      || process.env.BLOB_READ_WRITE_TOKENS_READ_WRITE_TOKEN
      || undefined;

    const response = await handleUpload({
      request,
      body,
      ...(token ? { token } : {}),
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('post-images/')) throw new Error('Invalid image upload path.');
        return {
          allowedContentTypes,
          maximumSizeInBytes: maxImageSize,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return Response.json(response);
  } catch (error) {
    console.error('Blob client upload failed', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Could not authorize image upload.' },
      { status: 400 },
    );
  }
}
