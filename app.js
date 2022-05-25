const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch("public");
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const connectLivereload = require("connect-livereload");

const express = require("express");
const app = express();
app.use(connectLivereload());
const port = 3125;

app.use("/", express.static("public"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
