import express from "express";
import path from "path";
import { streamify } from "./stolen";
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/audio", async (req, res) => {
  try {
    //@ts-ignore
    for await (const chunk of streamify(req.body.url)) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    res.writeHead(500);
    res.end(`internal system error : ", ${err}`);
  }
});

app.listen(process.env.PORT || 3001);
