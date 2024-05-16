import { doLogout, supabase } from "./main";

const form_search = document.getElementById("form_search");

const userId = localStorage.getItem("user_id");
document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_save") {
    form(event);
  }
});

form_search.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form_search);
  getDatas(formData.get("keyword"));
  document.getElementById("modal_close_search").click();
  form_search.reset();
};

document
  .getElementById("btn_logout")
  .addEventListener("click", function (event) {
    // Prevent the default behavior of the anchor tag
    event.preventDefault();
    doLogout();
  });
getDatas();
const form = async (e) => {
  e.preventDefault();
  const formData = new FormData(form_note);
  const { data, error } = await supabase.from("note").insert([
    {
      user_id: userId,
      title: formData.get("title"),
      description: formData.get("description"),
    },
  ]);
  if (error) {
    console.log(error);
  } else {
    alert("Conversation Added!");
    /* window.location.reload(); */

  
  }

  const { data: notes, error: notesError } = await supabase
  .from("note")
  .select("*")
  .eq("user_id", userId) // Filter by user_id instead of id
  .order("id", { ascending: false }) // Order by ID in descending order
  .range(0, 1); // Get only the last record

if (notesError) {
  console.error(notesError);
} else {
  if (notes.length > 0) {
   
    localStorage.setItem("last_note_id", notes[0].id);
    console.log("Last note ID:", notes[0].id);
      window.location.href = "AI.html";
  } else {
    console.log("No notes found for user ID:", userId);

  }
}


};

async function getDatas(keyword = "") {
  let { data: notes, error } = await supabase
    .from("note")
    .select("*")
    .eq("user_id", userId)
    .or("description.ilike.%" + keyword + "%, title.ilike.%" + keyword + "%");

  if (error) {
    console.error("Error fetching notes:", error);
    return;
  }

  let container = "";

  notes.forEach((datas) => {
    container += `
      <div class="mt-2">
        <div class="card w-100">
          <div id="card_color" class="card-body rounded">
            <h5 class="card-title">${datas.title}</h5>
            <hr>
            <p class="card-text">${datas.description}</p>
            <div class="row text-end">
              <div class="col-md-6 col-sm-6 text-sm-end"></div>
              <div class="col-md-6 col-sm-6 text-sm-end mb-2">
                <button type="button" data-bs-toggle="modal" data-bs-target="#form_modal_${datas.id}" id="btn_view" data-id="${datas.id}" class="btn btn-light me-md-2 my-1">View</button>
                <button type="button" id="btn_delete" data-id="${datas.id}" class="btn btn-light my-1">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal fade" tabindex="-1" id="form_modal_${datas.id}">
        <div class="modal-dialog">

        <div class="modal-content" style="background-color: #12171e;">

            <div class="modal-header">
            <h5 class="modal-title" style="color: white;">Note History</h5>


              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div id="convo_${datas.id}"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("noteContainer").innerHTML = container;

  // Add event listeners to the "View" buttons to fetch and display note history

  document.querySelectorAll('#btn_view').forEach(button => {
    button.addEventListener('click', async function () {
      const noteId = this.getAttribute('data-id');
      const convoContainerId = `convo_${noteId}`;
      console.log("Note ID:", noteId);
      const { data: conversations, error } = await supabase
        .from('conversation')
        .select('*')
        .eq('note_id', noteId);

        let convoContent ="";


      conversations.forEach((conversation) => {
        convoContent += `
         

        <div class="card mb-2">
        <div class="card-body">
          <h6 class="card-title">User: ${conversation.prompt}</h6>
        </div>
      </div>
      
      <div class="card mb-2">
        <div class="card-body">
          <h6 class="card-title">AI: ${conversation.response}</h6>
        </div>
      </div>
      
        
        `;
      });


      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }


      document.getElementById(convoContainerId).innerHTML = convoContent;
    });
  });
}


document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_delete") {
    deleteNote(event);
  }
});

const deleteNote = async (e) => {
  const id = e.target.getAttribute("data-id");
  console.log(id);

  const isConfirmed = window.confirm("Are you sure you want to delete Note?");

  // Check if the user has confirmed the deletion
  if (!isConfirmed) {
    return; // Abort the operation if the user cancels
  }

  try {
    const { error } = await supabase.from("note").delete().eq("id", id);
    Toastify({
      text: "Note deleted successfully",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "centered-toast",
      style: {
        background: "linear-gradient(to right, #12171e, #12171e)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();

    // Delay reload by 3 seconds (3000 milliseconds)
    setTimeout(function () {
      window.location.reload();
    }, 1500);
  } catch (error) {
    errorNotification("Something wrong happened. Cannot delete item.", 15);
    Toastify({
      text: `Error: ${error.message}`,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "centered-toast",
      style: {
        background: "linear-gradient(to right, #12171e, #12171e)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();

    setTimeout(function () {
      window.location.reload();
    }, 1500);
  }
};
