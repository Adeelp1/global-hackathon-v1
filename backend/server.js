'use strict';
import express from 'express';

const app = express();
app.use(express.json);


app.post("api/chat", (req, res) => {
    const {user_id, message} = req.body;
    res.json({ "success": "ok" });
})

app.get("/api/generate-blog", (req, res) => {
    const { user_id } = req.query;
    res.json({ "success": "ok" });
})