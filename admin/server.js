const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const port = 4310;
const filePath = path.join(__dirname, "founder-dashboard.html");

const server = http.createServer((request, response) => {
  if (request.url !== "/" && request.url !== "/founder-dashboard.html") {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  fs.readFile(filePath, "utf8", (error, html) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Founder dashboard file is not available.");
      return;
    }

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html);
  });
});

server.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`MapClap founder console: ${url}`);
  exec(`start "" "${url}"`);
});
