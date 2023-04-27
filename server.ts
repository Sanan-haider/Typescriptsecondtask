import * as http from 'http';
import * as fs from 'fs';

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/users") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const userData: any = JSON.parse(body);
      fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Error reading file");
        } else {
          const users = data ? JSON.parse(data) : [];
          users.push(userData);
          fs.writeFile("users.json", JSON.stringify(users), (err) => {
            if (err) {
              console.error(err);
              res.statusCode = 500;
              res.end("Error writing file");
            } else {
              res.statusCode = 200;
              res.end("User saved successfully");
            }
          });
        }
      });
    });
  }

  if (req.method === "GET" && req.url === "/users") {
    fs.readFile("users.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Error reading file");
      } else {
        const users = data ? JSON.parse(data) : [];
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify(users));
      }
    });
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});