import express from "express";

const app = express();

const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("EXPRESS SERVER");
});

app.listen(port, () => {
  console.log(`Server is live on port ${port}`);
});
