'use strict';
import express from 'express';
import OpenAI from 'openai';
import { Chat } from 'openai/resources';

const app = express();
app.use(express.json);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

const conversation_db = {} // temp storage space

// API: Chat
app.post("api/chat", async (req, res) => {
    const {user_id, message} = req.body;
    const convo = conversation_db[user_id];
    if (!convo) {
        convo = {conversation: JSON.stringify([{ role: "system", content: "You are a kind memory companion." }])};
        conversation_db[user_id] = convo.conversation;
    }

    let convoArr = JSON.parse(convo.conversation);
    convoArr.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: convoArr,
    });

    const reply = completion.choices[0].message.content;
    convoArr.push({ role: "assistant", content: reply});

    res.json({ reply });
});

// API: Generate Blog
app.get("/api/generate-blog", async (req, res) => {
    const { user_id } = req.query;
    const convo = conversation_db[user_id];
    if (!convo) return res.status(400).json({ error: "No conversation found" });

    const convoArr = JSON.parse(convo.conversation);
    const userOnly = convoArr.filter(msg => msg.role === "user").map(m => m.content).join("\n");

    const story = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "Turn the following conversation into a heartwarming life story." },
            { role: "user", content, userOnly },
        ],
    });

    const title = story.choices[0].message.content.split("\n")[0];

    res.json({ title, story: story.choices[0].message.content });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));