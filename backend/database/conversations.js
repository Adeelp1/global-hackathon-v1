'use strict';
import { get, run } from "./dbHelper.js";
import { db } from "../db.js";

// ----- QUERIES -----
const createConversations = `
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    conversation TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const getConversationsQuery = "SELECT * FROM conversations WHERE user_id = ?";
const putConversationsQuery = "INSERT INTO conversations (user_id, conversation) VALUES (?, ?)";
const updateConversationsQuery = "UPDATE conversations SET conversation = ? WHERE user_id = ?" ;

// ----- CRUD ----- 
async function getConversations(user_id) {
    return await get(getConversationsQuery, [user_id]);
}

async function putConversations(user_id, convo) {
    return await run(putConversationsQuery, [user_id, convo]);
}

async function updateConversations(user_id, convo) {
    return await run(updateConversationsQuery, [convo, user_id]);
}

// Create table
db.run(createConversations, (err) => {
  if (err) return err.message;
});

export {getConversations, putConversations, updateConversations}