import { supabase } from "../main";

const form_register = document.getElementById("form_register");

form_register.onsubmit = async (e) => {
  e.preventDefault();

  document.querySelector("#form_register button").disabled = true;
  document.querySelector(
    "#form_register button"
  ).innerHTML = `<div class="spinner-border me-2" role="status">
                      </div>
                      <span>Loading...</span>`;
  const formData = new FormData(form_register);

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password == confirmPassword) {
    //supabase log-in
    const { data, error } = await supabase.auth.signUp({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    let user_id = data?.user?.id;

    if (user_id != null) {
      //getting the info
      const { data, error } = await supabase
        .from("user_information")
        .insert([
          {
            user_id: user_id,
            full_name: formData.get("full_name"),
            username: formData.get("username"),
            gender: formData.get("gender"),
            phone_number: formData.get("phone_number"),
          },
        ])
        .select();

      //if succes registration condition
      if (error == null) {
        alert("Verification sent, please check your email!");

        window.location.href = "index.html";
      } else {
        alert(`Error: ${error.message}`);
      }

      form_register.reset();
    } else {
      alert(`Error: ${error.message}`);
      console.log(data);
      console.log(error);
    }
  } else {
    //button loading after password dont match
    alert("Password not match");

    document.querySelector("#form_register button").disabled = false;
    document.querySelector("#form_register button").innerHTML = "Register";
    /*  window.location.reload(); */
  }
};
