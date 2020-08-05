const express = require("express");

const postsRouter = require("./posts/posts-router");

const server = express();

server.use(express.json());

// Test Server
server.get("/", (req, res) => {
    res.send(`<h2>Node API 2 Project</h>`);
});

server.use("/api/posts", postsRouter);

server.listen(8000, () => {
    console.log("\n*** Server Running on http://localhost:4000 ***\n");
});
