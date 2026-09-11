import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import process from "node:process";

async function main() {
  console.log("[generate-static-index] Starting preview server to capture static SSR HTML...");
  const previewPort = 8099;
  const preview = spawn("npx", ["vite", "preview", "--port", String(previewPort)], {
    stdio: "ignore",
    shell: true,
  });

  let html = "";
  for (let attempt = 0; attempt < 40; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    try {
      html = await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${previewPort}/`, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(data));
        });
        req.on("error", reject);
      });
      if (html && html.includes("<html")) {
        break;
      }
    } catch {
      // Retry until preview server is up
    }
  }

  preview.kill();

  if (!html || !html.includes("<html")) {
    console.error("[generate-static-index] Failed to capture HTML from preview server.");
    process.exit(1);
  }

  // Adjust asset paths to be relative for Capacitor / static file hosting
  const adjustedHtml = html
    .replace(/href="\/assets\//g, 'href="./assets/')
    .replace(/src="\/assets\//g, 'src="./assets/');

  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist", { recursive: true });
  }

  fs.writeFileSync("dist/index.html", adjustedHtml, "utf8");
  console.log(`[generate-static-index] Successfully wrote dist/index.html (${adjustedHtml.length} bytes)`);
}

main().catch((err) => {
  console.error("[generate-static-index] Error:", err);
  process.exit(1);
});
