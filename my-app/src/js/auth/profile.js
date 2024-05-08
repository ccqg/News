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
  change_image.reset();

  // Enable Submit Button
};

async function getName() {
  try {
    // Fetch user information
    let { data: profiles, error: userError } = await supabase
      .from("user_information")
      .select("*")
      .eq("id", userId);

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
    // Fetch user information
    let { data: profiles, error: userError } = await supabase
      .from("user_information")
      .select("*")
      .eq("id", userId);

    //ge declare ug empty para makahimo ug dynamic nga output

    let container = "";

    profiles.forEach((user_info) => {
      //Dynamic Navbar para mag baylo2 base sa ga log-in na user
      container += `
        <div class="d-flex justify-content-center" >
        <!-- connector to javaS image -->
        <div
          class = "mb-5"
          style="width: 200px; height: 180px;"
          id="imageContainer" 
        ><div data-id="${
          user_info.image_path
        }"><img class="block my-2 border border-light border-2 rounded-circle" src="${
        itemsImageUrl + user_info.image_path
      }" width="100%" height="200rem"></div></div>
      </div>
      <div>
          `;
    });

    document.getElementById("userContainer").innerHTML = container;
  } catch (error) {
    console(error.message);
  }
}

async function viewEdit() {
  // Supabase show by id
  let { data: profiles, error } = await supabase
    .from("user_information")
    .select("*")
    .eq("id", userId)
    .single(); // Assuming you only expect one result

  if (error == null) {
    // Store id to a variable; id will be utilized for update
    for_update_id = profiles.id;

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
    alert("Work in Progress");
  }
});
