const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const generateBtn = document.getElementById("generate-btn");

let conversation = []; // Store conversation locally

sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  // Show user message
  addMessage(message, "user");
  userInput.value = "";

  // Send to backend
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: 1, message })
  });

  const data = await res.json();

  // Show AI reply
  addMessage(data.reply, "ai");
});

generateBtn.addEventListener("click", async () => {
  // Redirect to blog.html
  window.location.href = 'blog.html';
  // const res = await fetch("http://localhost:5000/api/generate-blog?user_id=1");
  // const data = await res.json();
  console.log(data);
  // Save message to the localstorage
  localStorage.setItem("latestStory", data.story);
  localStorage.setItem("latestTitle", data.title);



});

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
