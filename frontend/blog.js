const blogsContainer = document.getElementById("blogs-container");
const generate_blog = document.getElementById("generate-blog");
const generate_memory = document.getElementById("generate-memory");
const memory_query = document.getElementById("memory-query");

generate_blog.addEventListener("click", async () => {
    // const blogsContainer = document.getElementById("blogs-container");

    const res = await fetch("https://global-hackathon-v1-bhv6.onrender.com/api/generate-blog?user_id=1");
    const data = await res.json();

    // Read story from localStorage
    const story = data.story;
    const title = data.title;
    
    // if (data.titile || data.story) {
        const div = document.createElement("div");
        div.classList.add("blog");
        div.innerHTML = `
            <h3>${title}</h3>
            <p>${story}</p>
        `;

        blogsContainer.appendChild(div);
        // Optionally clear it after ahowing
        localStorage.removeItem("latestStory");
        localStorage.removeItem("latestTitle");
    // }
    // else {
    //     blogsContainer.innerHTML = "<p>No new story found.</p>";
    // }
});

generate_memory.addEventListener('click', async () => {
    const message = memory_query.value.trim();
    if (!message) return;
    memory_query.value = "";

    const res = await fetch("https://global-hackathon-v1-bhv6.onrender.com/api/generate-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, message })
    });

    const data = await res.json();

    const title = data.title;
    const story = data.story;

    const div = document.createElement("div");
    div.classList.add("blog");
    div.innerHTML = `
        <h3>${story}</h3>
    `;

    blogsContainer.appendChild(div);
});