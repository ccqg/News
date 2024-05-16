import { supabase } from "./main";


const itemsImageUrl =
  "https://jdrbeyywzehkravlqofg.supabase.co/storage/v1/object/public/profile_picture/";

const AIimage = "https://jdrbeyywzehkravlqofg.supabase.co/storage/v1/object/public/profile_picture/public/chatgpt-icon.png";
  
const messageBar = document.querySelector(".bar-wrapper input");
const sendBtn = document.querySelector(".bar-wrapper button");
const messageBox = document.querySelector(".message-box");
const userId = localStorage.getItem("user_id");

const lastNoteId = localStorage.getItem("last_note_id");
console.log(lastNoteId);

let API_URL = "https://api.openai.com/v1/chat/completions";
let API_KEY = "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";


sendBtn.onclick = async function () {

  let { data: profiles, error: userError } = await supabase
  .from("user_information")
  .select("*")
  .eq("id", userId);

  let message  = "";
  let response = "";

  
  if (messageBar.value.length > 0) {
    const UserTypedMessage = messageBar.value;
    messageBar.value = "";

    // Generate a unique ID for the user-typed message
    const userMessageId = 'user-message-' + Date.now();
    profiles.forEach((data) => {
      message = `<div id="${userMessageId}" class="chat message">
      <img src="${itemsImageUrl + data.image_path}" />
      <span>${UserTypedMessage}</span>
    </div>`;
    response = `<div class="chat response">
      <img src="${AIimage}" />
      <span class="new">...</span>
    </div>`;

    })
   
  

    messageBox.insertAdjacentHTML("beforeend", message);

    setTimeout(async () => {
      messageBox.insertAdjacentHTML("beforeend", response);

      // Predefined responses with multiple options
      const predefinedResponses = {
        "hello": [
          "Hi there! How can I assist you today?", 
          "Hello! What can I do for you?", 
          "Hey! How can I help you?", 
          "Greetings! How can I be of service?", 
          "Hi! What do you need help with?", 
          "Hello! How's it going?", 
          "Hey! What brings you here today?", 
          "Hi! Need any assistance?", 
          "Hello! How can I make your day better?", 
          "Hi! What's on your mind?"
        ],
        "how are you": [
          "I'm just a bunch of code, but I'm here to help!", 
          "I'm an AI, so I don't have feelings, but thanks for asking!", 
          "I'm here to assist you with whatever you need.", 
          "I'm always ready to help you out!", 
          "I'm just a virtual assistant, but I'm functioning perfectly!", 
          "I'm doing great, thanks! What about you?", 
          "I'm here and ready to assist you!", 
          "I don't have emotions, but I'm here to help!", 
          "I'm here to support you. What can I do?", 
          "I'm operational and ready to assist!"
        ],
        "bye": [
          "Goodbye! Have a great day!", 
          "See you later! Take care!", 
          "Bye! Don't hesitate to come back if you need more help!", 
          "Farewell! Reach out anytime you need assistance.", 
          "Goodbye! Stay safe!", 
          "See you! Have a wonderful day!", 
          "Take care! I'll be here if you need anything else.", 
          "Bye! Wishing you all the best!", 
          "Goodbye! Feel free to return anytime.", 
          "See you! Remember, I'm always here to help."
        ],
        "default": [
          "I'm not sure how to respond to that. Can you ask something else?", 
          "Hmm, I don't quite understand. Could you try rephrasing?", 
          "Sorry, I didn't get that. Can you ask in a different way?", 
          "I'm not sure what you mean. Could you elaborate?", 
          "Can you clarify your question? I'm here to help!", 
          "I'm having trouble understanding. Can you ask differently?", 
          "I'm sorry, could you say that in another way?", 
          "That doesn't seem clear. Can you try again?", 
          "I'm not sure how to help with that. Can you ask another question?", 
          "I didn't catch that. Could you rephrase your query?"
        ]
      };

      const getResponse = (userMessage) => {
        const lowerCaseMessage = userMessage.toLowerCase();
        const responses = predefinedResponses[lowerCaseMessage] || predefinedResponses["default"];
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
      };

      const chosenResponse = getResponse(UserTypedMessage);
      console.log("Chosen response:", chosenResponse);

      const { data, error } = await supabase.from("conversation").insert([
        {
          prompt: UserTypedMessage,
            response: chosenResponse,
            note_id: lastNoteId
        
        },
      ]);
      if (error) {
        console.log(error);
      } else {
       
        console.log("Conversation Added!");
      }

      const ChatBotResponse = document.querySelector(".response .new");
      ChatBotResponse.innerHTML = chosenResponse;
      ChatBotResponse.classList.remove("new");
    }, 100);
  }
};
