import ImageKit from "imagekit-javascript";
import api from "@/api/interceptor";

export async function uploadToImageKit(file) {
  try {
    const auth = await api.get("/api/imagekit-auth/"); 

    const imagekit = new ImageKit({
      publicKey: auth.data.public_key,
      urlEndpoint: import.meta.env.VITE_IK_URL_ENDPOINT,
    });

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file,
          fileName: file.name,
          folder: "/blog",
          tags: ["blog-image"],
          token: auth.data.token,
          signature: auth.data.signature,
          expire: auth.data.expire,
        },
        function (err, result) {
          if (err) {
            console.error("Upload error:", err); 
            return reject(err);
          }
          resolve(result.url);
        }
      );
    });
  } catch (error) {
    console.error("ImageKit Upload Error", error);
    throw error;
  }
}
