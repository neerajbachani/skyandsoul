import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { v2 as cloudinary } from "cloudinary";

function loadEnv() {
  const envPath = join(process.cwd(), ".env");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnv();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET in .env",
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const DOC2_DIR = join(process.cwd(), "public/images/doc2");
const OUTPUT_PATH = join(process.cwd(), "scripts/doc2-cloudinary-urls.json");

async function main() {
  const files = readdirSync(DOC2_DIR).sort();
  const urls: Record<string, string> = {};

  for (const filename of files) {
    const filePath = join(DOC2_DIR, filename);
    const publicId = basename(filename, extname(filename));

    console.log(`Uploading ${filename}...`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "skyandsoul/doc2",
      public_id: publicId,
      overwrite: true,
      resource_type: "auto",
    });

    urls[filename] = result.secure_url;
    console.log(`  -> ${result.secure_url}`);
  }

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(urls, null, 2)}\n`);
  console.log(`\nSaved ${Object.keys(urls).length} URLs to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
