import { writeFile, mkdir } from "node:fs/promises";

const targetUrl = "http://rei.monoteam.top/songs.php";

const response = await fetch(targetUrl, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/120.0.0.0 Safari/537.36",
    Referer: "http://rei.monoteam.top/",
    Accept: "application/json, text/plain, */*",
  },
});

if (!response.ok) {
  throw new Error(`源站响应异常：HTTP ${response.status}`);
}

const rawText = (await response.text()).trim();

let data;

try {
  const parsed = JSON.parse(rawText);
  data = Array.isArray(parsed) ? parsed : [parsed];
} catch {
  data = rawText
    .split("\n")
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((item) => item !== null);
}

if (!Array.isArray(data) || data.length === 0) {
  throw new Error("未获得有效歌单数据");
}

// 假设你的 GitHub Pages 文件位于 docs 目录
// await mkdir("docs", { recursive: true });

await writeFile(
  "docs/songs.json",
  JSON.stringify(data, null, 2),
  "utf8",
);

console.log(`已获取 ${data.length} 首歌曲`);