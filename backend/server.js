'use strict';
import express from "express";
import Groq from "groq-sdk";
import cors from "cors";
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from "url";

import {db} from "./db.js";
import { getConversations, putConversations, updateConversations } from "./database/conversations.js";
import { error } from "console";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../frontend')));

const groq = new Groq({ apiKey: process.env.OPENAI_API_KEY });

// API: Chat
app.post("/api/chat", async (req, res) => {
  const { user_id, message } = req.body;

  let convo = await getConversations(user_id);

  if (!convo) {
    convo = { conversation: JSON.stringify([{ role: "system", content: process.env.CHAT_PROMPT}]) };
    await putConversations(user_id, convo.conversation);
  }

  let convoArr = JSON.parse(convo.conversation);
  convoArr.push({ role: "user", content: message });

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: convoArr,
  });

  const reply = completion.choices[0].message.content;
  convoArr.push({ role: "assistant", content: reply });
  console.log(reply)

  await updateConversations(user_id, JSON.stringify(convoArr));

  res.json({ reply: reply });
});

// API: Generate Memory
app.post("/api/generate-memory", async (req, res) => {
    const { user_id, message } = req.body;

    let convo = await getConversations(user_id);

    if (!convo) return res.status(404).json({ error: "No memory found"});

    const convoArr = JSON.parse(convo.conversation);
    const userOnly = convoArr.filter(msg => msg.role === "user").map(m => m.content).join("\n");

    const story = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: process.env.MEMORY_PROMPT },
            { role: "user", content: `user asked: "${message}". here are the available memories:\n${userOnly}` },
        ],
    });

    const title = story.choices[0].message.content.split("\n")[0];
    res.json({ title: title, story: story.choices[0].message.content });

})

// API: Generate Blog
app.get("/api/generate-blog", async (req, res) => {
  const { user_id } = req.query;
  const convo = await getConversations(user_id);
  if (!convo) return res.status(404).json({ error: "No conversation found" });

  const convoArr = JSON.parse(convo.conversation);
  const userOnly = convoArr.filter(msg => msg.role === "user").map(m => m.content).join("\n");

  const story = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: process.env.BLOG_PROMPT },
      { role: "user", content: userOnly },
    ],
  });

  const title = story.choices[0].message.content.split("\n")[0];
  res.json({ title: title, story: story.choices[0].message.content });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));

// close db
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error(err.message);
        console.log("closed the database connection.");
        process.exit(0);
    });
}); 