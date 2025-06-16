import express from "express";
import bodyParser from "body-parser";
import { blockAllProfanity } from "./middleswares/blockAll.js";
import { cleanWithCustomPlaceholder } from "./middleswares/cleanWithCustomPlaceholder.js";

const app = express();
app.use(bodyParser.json());

// Route 1: Blocks if profanity is detected, returns error message
app.post("/block", blockAllProfanity, (req, res) => {
  res.json({
    message: "Content accepted. No profanity detected.",
    content: req.body.content,
  });
});

// Route 2: Cleans profanity with custom placeholder, always passes content along
app.post("/clean", cleanWithCustomPlaceholder("###"), (req, res) => {
  res.json({
    message: "Content processed (profane words cleaned if needed).",
    content: req.body.content,
    profanity: req.profanity,
  });
});

app.post("/send-message", cleanWithCustomPlaceholder("###"), (req, res) => {
  // req.body.content is now cleaned!
  // Save to DB or broadcast to other users
  // Example: chatDB.save(req.body.content) or chatSocket.emit('message', req.body.content);
  console.log(req.body.content)
  res.json({
    status: "success",
    cleanedMessage: req.body.content,
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}
  - POST to /block for blocking on profanity
  - POST to /clean for auto-cleaning with placeholder`)
);
