const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  [...document.querySelectorAll(selector)];


const state = {

  model: "Nova Pro",

  streaming: true,

  attachments: [],

  chats: []

};


const messages =
  $("#messages");

const welcome =
  $("#welcome");

const input =
  $("#promptInput");

const composer =
  $("#composer");


/* HTML SECURITY */

function escapeHTML(str) {

  return str.replace(
    /[&<>"']/g,

    character => ({

      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"

    }[character])
  );

}


/* ADD MESSAGE */

function addMessage(
  role,
  text,
  streaming = false
) {

  welcome.style.display =
    "none";


  const element =
    document.createElement("div");


  element.className =
    `message ${role}`;


  if (role === "ai") {

    element.innerHTML = `

      <div class="mini-avatar">
        ✦
      </div>

      <div class="bubble">

        ${
          streaming

          ?

          `
          <span class="typing">

            <i></i>
            <i></i>
            <i></i>

          </span>
          `

          :

          escapeHTML(text)

        }

      </div>

    `;

  }

  else {

    element.innerHTML = `

      <div class="bubble">

        ${escapeHTML(text)}

      </div>

    `;

  }


  messages.appendChild(element);


  messages.scrollTop =
    messages.scrollHeight;


  return element;

}


/* DEMO AI RESPONSE */

function fakeResponse(prompt) {

  const p =
    prompt.toLowerCase();


  if (
    p.includes("website") ||
    p.includes("app")
  ) {

    return `Absolutely. I can help you build that.

A strong architecture would be:

• Responsive frontend with a premium component system
• Secure backend API layer
• Authentication and user sessions
• Database for conversations and preferences
• Streaming AI responses
• File upload pipeline
• Production error handling and rate limiting

Tell me the exact feature you want to implement first and I can generate the code.`;

  }


  if (
    p.includes("python")
  ) {

    return `Here is a practical Python project path:

1. Build the core application
2. Add data validation and error handling
3. Connect a database
4. Expose REST APIs
5. Add authentication
6. Write tests
7. Deploy it

I can turn this into a complete project structure with source code.`;

  }


  if (
    p.includes("api")
  ) {

    return `A REST API lets your frontend communicate with a backend through HTTP endpoints.

A typical flow is:

Frontend
↓
POST /api/chat
↓
Backend
↓
AI provider
↓
Backend
↓
Streaming response
↓
Frontend

For production, keep your AI API key on the server — not inside browser JavaScript.`;

  }


  return `I'm ready to help with that.

This demo currently uses a local response simulator so the interface works without an API key.

To make it a real AI assistant, connect the request handler in the API layer to your preferred model provider and stream the response back to the browser.`;

}


/* SEND MESSAGE */

async function sendMessage(text) {

  text =
    text.trim();


  if (!text)
    return;


  addMessage(
    "user",
    text
  );


  input.value = "";

  input.style.height =
    "auto";


  const ai =
    addMessage(
      "ai",
      "",
      true
    );


  const bubble =
    ai.querySelector(
      ".bubble"
    );


  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        500
      )
  );


  const answer =
    fakeResponse(text);


  /* NORMAL RESPONSE */

  if (!state.streaming) {

    bubble.textContent =
      answer;

    messages.scrollTop =
      messages.scrollHeight;

    return;

  }


  /* STREAM RESPONSE */

  bubble.textContent = "";


  let index = 0;


  const timer =
    setInterval(() => {

      bubble.textContent +=
        answer[index++] || "";


      messages.scrollTop =
        messages.scrollHeight;


      if (
        index >=
        answer.length
      ) {

        clearInterval(timer);

      }

    }, 10);

}


/* FORM SUBMIT */

composer.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    sendMessage(
      input.value
    );

  }
);


/* AUTO RESIZE */

input.addEventListener(
  "input",
  () => {

    input.style.height =
      "auto";

    input.style.height =
      Math.min(
        input.scrollHeight,
        130
      ) + "px";

  }
);


/* ENTER TO SEND */

input.addEventListener(
  "keydown",
  event => {

    const enabled =
      $("#enterToggle").checked;


    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      enabled
    ) {

      event.preventDefault();

      composer.requestSubmit();

    }

  }
);


/* QUICK PROMPTS */

$$(".suggestions button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        sendMessage(
          button.dataset.prompt
        );

      }
    );

  });


/* FILE UPLOAD */

$("#attachBtn")
  .addEventListener(
    "click",
    () => {

      $("#fileInput").click();

    }
  );


$("#fileInput")
  .addEventListener(
    "change",
    event => {

      state.attachments =
        [...event.target.files];


      $("#attachmentPreview")
        .innerHTML =
        state.attachments
          .map(
            file =>
              `<span class="file-chip">
                📎 ${escapeHTML(file.name)}
              </span>`
          )
          .join("");

    }
  );


/* MODEL SELECTOR */

$("#modelSelector")
  .addEventListener(
    "click",
    () => {

      $("#modelMenu")
        .classList
        .toggle("open");

    }
  );


$$(".model-menu button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        state.model =
          button.dataset.model;


        $("#currentModel")
          .textContent =
          state.model;


        $("#modelMenu")
          .classList
          .remove("open");

      }
    );

  });


/* CLOSE MODEL MENU */

document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        ".model-wrap"
      )
    ) {

      $("#modelMenu")
        .classList
        .remove("open");

    }

  }
);


/* MODALS */

function openModal(id) {

  $("#overlay")
    .classList
    .add("open");


  $(id)
    .classList
    .add("open");

}


function closeModals() {

  $("#overlay")
    .classList
    .remove("open");


  $$(".modal")
    .forEach(
      modal =>
        modal.classList
          .remove("open")
    );

}


$("#settingsBtn")
  .addEventListener(
    "click",
    () =>
      openModal(
        "#settingsModal"
      )
  );


$("#loginBtn")
  .addEventListener(
    "click",
    () =>
      openModal(
        "#authModal"
      )
  );


$("#profileBtn")
  .addEventListener(
    "click",
    () =>
      openModal(
        "#authModal"
      )
  );


$("#overlay")
  .addEventListener(
    "click",
    closeModals
  );


$$(".modal-close")
  .forEach(button => {

    button.addEventListener(
      "click",
      closeModals
    );

  });


/* STREAMING SETTING */

$("#streamToggle")
  .addEventListener(
    "change",
    event => {

      state.streaming =
        event.target.checked;

    }
  );


/* NEW CHAT */

$("#newChat")
  .addEventListener(
    "click",
    () => {

      messages.innerHTML = "";

      welcome.style.display =
        "block";

      input.focus();

    }
  );


/* SHARE */

$("#shareBtn")
  .addEventListener(
    "click",
    async () => {

      try {

        await navigator.clipboard
          .writeText(
            location.href
          );

      }

      catch {}

      alert(
        "Chat link copied."
      );

    }
  );


/* MOBILE SIDEBAR */

const sidebar =
  $("#sidebar");


$("#openSidebar")
  .addEventListener(
    "click",
    () => {

      sidebar.classList
        .add("open");

      $("#overlay")
        .classList
        .add("open");

    }
  );


$("#closeSidebar")
  .addEventListener(
    "click",
    () => {

      sidebar.classList
        .remove("open");

      $("#overlay")
        .classList
        .remove("open");

    }
  );


/* VOICE INPUT */

$("#micBtn")
  .addEventListener(
    "click",
    () => {

      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


      if (!SpeechRecognition) {

        alert(
          "Voice input is not supported in this browser."
        );

        return;

      }


      const recognition =
        new SpeechRecognition();


      recognition.lang =
        "en-US";


      recognition.interimResults =
        true;


      const button =
        $("#micBtn");


      button.classList
        .add("recording");


      recognition.onresult =
        event => {

          input.value =
            [...event.results]
              .map(
                result =>
                  result[0]
                    .transcript
              )
              .join("");

        };


      recognition.onend =
        () => {

          button.classList
            .remove(
              "recording"
            );

        };


      recognition.start();

    }
  );


/* COMMAND + K */

document.addEventListener(
  "keydown",
  event => {

    if (
      (event.metaKey ||
       event.ctrlKey) &&
      event.key.toLowerCase() === "k"
    ) {

      event.preventDefault();

      input.focus();

    }

  }
);


/*
====================================================
REAL API INTEGRATION
====================================================

Replace fakeResponse() with your backend request.

Example:

async function streamFromAPI(prompt) {

  const response =
    await fetch("/api/chat", {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({

        model: state.model,

        message: prompt

      })

    });


  if (!response.ok) {

    throw new Error(
      "API request failed"
    );

  }


  return response.body;

}


IMPORTANT:

Never put your private AI provider
API key inside this JavaScript file.

Use:

Browser
   ↓
Your backend /api/chat
   ↓
AI provider
   ↓
Streaming response
   ↓
Browser

====================================================
*/


input.focus();