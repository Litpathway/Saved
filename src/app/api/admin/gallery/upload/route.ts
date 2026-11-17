import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { administrator } from "@/lib/auth";
import { sameOrigin, error } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!sameOrigin(request) || !(await administrator()))
          throw new Error("Unauthorized upload");
        if (!pathname.startsWith("gallery/"))
          throw new Error("Invalid gallery path");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"],
          maximumSizeInBytes: 100 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // The authenticated browser registers metadata after the Blob upload.
      },
    });
    return Response.json(result);
  } catch {
    return error("Unable to authorize upload. Check your login and storage setup.", 400);
  }
}
