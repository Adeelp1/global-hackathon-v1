'use strict';
import express from 'express';
import OpenAI from 'openai';

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
})

app.get("/api/generate-blog", (req, res) => {
    const { user_id } = req.query;
    res.json({ "success": "ok" });
})