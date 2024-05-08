import { supabase } from "../main";

const loginForm = document.getElementById("loginForm");

loginForm.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);

  //supabase sign-in

  let { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  let session = data.session;
  let user = data.user;
  console.log(user);
  if (session != null) {
    localStorage.setItem("access_token", session.access_token);
    localStorage.setItem("refresh_token", session.refresh_token);

    // Save user id in local storage
    localStorage.setItem("auth_id", user?.id);

    let { data: user_information, error } = await supabase
      .from("user_information")
      .select("*")
      .eq("user_id", localStorage.getItem("auth_id"));

    localStorage.setItem("user_id", user_information[0].id);
    console.log(user_information[0].id);

    window.location.pathname = "/note.html";
  } else {
    alert(`Error: ${error.message}`);
    console.log(error);
  }

  loginForm.reset();
};
