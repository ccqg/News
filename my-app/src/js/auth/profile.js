import { supabase } from "../main";

const itemsImageUrl =
  "https://jdrbeyywzehkravlqofg.supabase.co/storage/v1/object/public/profile_picture/";

const userId = localStorage.getItem("user_id");
console.log(userId);

getPicture();

viewEdit();
getName();
let for_update_id = "";

//edit or upload image

change_image.onsubmit = async (e) => {
  e.preventDefault();
  // Disable Button
  let { data: profiles, error } = await supabase
    .from("user_information")
    .select("*")
    .eq("id", userId);

  for_update_id = profiles[0].id;

  const formData = new FormData(change_image);

  // Check if image input is null
  let image_path = formData.get("image_path");
  let image_data = null;
  if (!image_path) {
    // Retrieve the last saved image path
    // Assuming you have a variable holding the last saved image path
    // Replace 'last_saved_image_path' with the variable holding the last saved image path
    image_path = last_saved_image_path;
  } else {
    // Supabase Image Upload
    const image = formData.get("image_path");
    const { data, error } = await supabase.storage
      .from("profile_picture")
      .upload("public/" + image.name, image, {
        cacheControl: "3600",
        upsert: true,
      });
    image_data = data;

    // Error notification for upload
    if (error) {
      console.log(
        "Something wrong happened. Cannot upload image, image size might be too big. You may update the item's image."
      );
      console.log(error);
    }
  }

  // Insert or update data
  if (for_update_id == "") {
    const { data, error } = await supabase
      .from("user_information")
      .insert([
        {
          image_path: image_data ? image_data.path : image_path,
        },
      ])
      .select();

    if (error) {
      console.log("Something wrong happened. Cannot add picture.");
      console.log(error);
    } else {
      alert("picture Successfully Added!");

      /* window.location.reload(); */
    }
  } else {
    const { data, error } = await supabase
      .from("user_information")
      .update({
        image_path: image_data ? image_data.path : image_path,
      })
      .eq("id", for_update_id)
      .select();

    if (error == null) {
      alert("Profile Picture Updated Successfully!");

      // Reset storage id
      for_update_id = "";
      /* reload datas */
      getPicture();
    } else {
      alert("Something wrong happened. Cannot add picture.");
      console.log(error);
    }
     
  }

  // Modal Close
  /* document.getElementById("modal_close").click(); */

  // Reset Form




  // Enable Submit Button
};

async function getName() {
  try {
    // Fetch user information
    let { data: profiles, error: userError } = await supabase
      .from("user_information")
      .select("*")
      .eq("id", userId);

      console.log(userId);

    //ge declare ug empty para makahimo ug dynamic nga output

    let container = "";

    profiles.forEach((user_info) => {
      //Dynamic Navbar para mag baylo2 base sa ga log-in na user
      container += `
          <h1 class="bot form-title">${user_info.username}</h1>
        
            `;
    });

    document.getElementById("nameContainer").innerHTML = container;
  } catch (error) {
    console(error.message);
  }
}

//show profice picture FUnction

async function getPicture() {
  try {
    document.querySelector(
      "#change_image button[type='submit']"
    ).disabled = true;
    document.querySelector(
      "#change_image button[type='submit']"
    ).innerHTML = `<span>Loading...</span>`;
    
    // Fetch user information
    let { data: profiles, error: userError } = await supabase
      .from("user_information")
      .select("*")
      .eq("id", userId);

    // Declare an empty string to dynamically generate output
    let container = "";

    profiles.forEach((user_info) => {
      // Dynamic content for user image
      container += `
        <div class="d-flex justify-content-center">
          <div 
            class="mb-5"
            style="width: 200px; height: 180px;"
            id="imageContainer"
          >
            <div data-id="${user_info.image_path}">
              <img 
                class="block my-2 border border-light border-2 rounded-circle" 
                src="${itemsImageUrl + user_info.image_path}" 
                width="100%" 
                height="200rem"
              >
            </div>
          </div>
        </div>`;
    });

    // Inject generated content into the DOM
    document.getElementById("userContainer").innerHTML = container;
    
  } catch (error) {
    console.error(error.message); // Corrected from console to console.error
  }
  
  // Reset form and re-enable submit button
  change_image.reset();
  document.querySelector(
    "#change_image button[type='submit']"
  ).disabled = false;
  document.querySelector(
    "#change_image button[type='submit']"
  ).innerHTML = `Submit`;
}

let update_profile = "";
async function viewEdit() {
  // Supabase show by id
  let { data: profiles, error } = await supabase
    .from("user_information")
    .select("*")
    .eq("id", userId)
    .single(); // Assuming you only expect one result

  if (error == null) {
    // Store id to a variable; id will be utilized for update
    update_profile = profiles.id;

    // Assign values to the form
    document.getElementById("username").value = profiles.username;
    document.getElementById("full_name").value = profiles.full_name;
    document.getElementById("birthdate").value = profiles.birthdate;
    document.getElementById("phone_number").value = profiles.phone_number;

    // Change Button Text using textContent; either innerHTML or textContent is fine here
  } else {
    errorNotification("Something wrong happened. Cannot show item.", 15);
    console.log(error);
  }
}

// Assuming you have a container in your HTML with an id, for example, "userContainer"
// initialize ug container
document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_save") {
   onSubmitHandler(event);
  }
});



const onSubmitHandler = async (e) => {
  e.preventDefault();
  document.querySelector(
    "#form_profile button[type='button']"
  ).disabled = true;
  document.querySelector(
    "#form_profile button[type='button']"
  ).innerHTML = `
                  <span>Loading...</span>`;
                  const formData = new FormData(form_profile);

                  if (update_profile == "") {
                    const { data, error } = await supabase
                      .from("user_information")
                      .insert([
                        {
                          username: formData.get("username"),
                          full_name: formData.get("full_name"),
                          phone_number: formData.get("phone_number"),
                          birthdate: formData.get("birthdate")
                        },
                      ])
                      .select();
                    if (error) {
                      alert("Something wrong happened. Cannot add info.");
                      console.log(error);
                    } else {
                      alert("Information Successfully Added!");
                      window.location.reload();
                    }
                  
                  
                  
                    // Reset Form
                    form_profile.reset();
                  
                    // Enable Submit Button
                    document.querySelector(
                      "#form_profile button[type='button']"
                    ).disabled = false;
                    document.querySelector(
                      "#form_profile button[type='button']"
                    ).innerHTML = `Submit`;
                  } else {
                    const { data, error } = await supabase
                      .from("user_information")
                      .update({
                        username: formData.get("username"),
                        full_name: formData.get("full_name"),
                        phone_number: formData.get("phone_number"),
                        birthdate: formData.get("birthdate"),
                      })
                      .eq("id", update_profile)
                      .select();
                    if (error == null) {
                      alert("Information Successfully Updated!");
                      window.location.reload();
                    } else {
                      alert("Something wrong happened. Cannot update info.");
                      console.log(error);
                    }
                  
                    // Reset Form
                    form_profile.reset();
                  
                    // Enable Submit Button
                    document.querySelector(
                      "#form_profile button[type='button']"
                    ).disabled = false;
                    document.querySelector(
                      "#form_profile button[type='button']"
                    ).innerHTML = `Submit`;
                  }
                  

                  
};
