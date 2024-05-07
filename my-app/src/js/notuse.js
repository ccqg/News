// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// Show the wrapper after the page has fully loaded

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wtstajjtiaocfyttavbm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0c3Rhamp0aWFvY2Z5dHRhdmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3NjcxMzksImV4cCI6MjAyNTM0MzEzOX0.O0EVGa9iUgkNNtQR03T4yn9qfo3-vNnHuaj2gegKdDU"
);
export { supabase };

window.addEventListener("load", function () {
  var loader = document.querySelector(".loader");
  var wrapper = document.querySelector(".wrapper");
  loader.classList.add("loader--hidden");
  wrapper.style.display = "block";
});

// Show loader when the register link is clicked
document
  .getElementById("registerLink")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    var loader = document.querySelector(".loader");
    var wrapper = document.querySelector(".wrapper");
    loader.classList.remove("loader--hidden");
    wrapper.style.display = "none"; // Hide content while loading
    setTimeout(function () {
      // Simulate loading time
      window.location.href = "register.html"; // Redirect to register form
    }, 300); // Adjust the loading time as needed (in milliseconds)
  });

const messageBar = document.querySelector(".bar-wrapper input");
const sendBtn = document.querySelector(".bar-wrapper button");
const messageBox = document.querySelector(".message-box");

let API_URL = "https://api.openai.com/v1/chat/completions";
let API_KEY = "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";

sendBtn.onclick = function () {
  if (messageBar.value.length > 0) {
    const UserTypedMessage = messageBar.value;
    messageBar.value = "";
    let message = `<div class="chat message">
    <img src="./assets/imgs/x1.jpg" />
    <span>${UserTypedMessage}
    </span>
  </div>`;

    let response = `<div class="chat response">
  <img src="./assets/icon/chatgpt-icon.png" />
  <span class= "new">...
  </span>
</div>`;

    messageBox.insertAdjacentHTML("beforeend", message);

    setTimeout(() => {
      messageBox.insertAdjacentHTML("beforeend", response);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: UserTypedMessage }],
        }),
      };
      fetch(API_URL, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          const ChatBotResponse = document.querySelector(".response .new");
          ChatBotResponse.innerHTML = data.choices[0].message.content;
          ChatBotResponse.classList.remove("new");
        })
        .catch((error) => {
          ChatBotResponse.innerHTML =
            "Opps! There's an error. Please try again!";
        });
    }, 100);
  }
};
