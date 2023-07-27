const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
  const themeColor = localStorage.getItem("theme-color");
  document.body.classList.toggle("light-mode", themeColor === "🔦");
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "💡"
    : "🔦";

  const defaultText = `<div class="default-text">
                         <h1>ChatGPT Clone</h1>
                         <p>Start a conversation and explore the power of AI. <br> Your chat history will be displayed here.</p> 
    
    </div>`;
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

loadDataFromLocalstorage();

createElement = (html, className) => {
  //  create new div and apply chat, specified class and set html content of div
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv; //return the created chat div
};

const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };
  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    pElement.textContent = response.choices[0].text.trim();
  } catch (error) {
      pElement.classList.add("error");
      pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const copyResponse = (copyBtn) => {
  const responseTextElement = copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(responseTextElement.textContent);
  copyBtn.textContent = "✅";
  setTimeout(() => (copyBtn.textContent = "🔗"), 1000);
};

const showTypingAnimation = () => {
  const html = `<div class="chat-content">
<div class="chat-details">
<img src="chatbot.jpg" width="100px" alt="" />
<div class="typing-animation">
  <div class="typing-dot" style="--delay: 0.2s"></div>
  <div class="typing-dot" style="--delay: 0.3s"></div>
  <div class="typing-dot" style="--delay: 0.4s"></div>
</div>
</div>
<span onclick="copyResponse(this)" class="material-symbol-rounded">🔗</span>
</div>`;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
  userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if (!userText) return;
    
    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;
    
  const html = `<div class="chat-content">
<div class="chat-details">
<img src="cloth-1.jpg" width="100px" alt="" />
<p>

</p>
</div>
</div>`;

  const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
};

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color", themeButton.innerText);
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "💡"
    : "🔦";
});

deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
  }
});

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);
