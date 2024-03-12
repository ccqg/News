import { supabase } from "../main";

const form_register = document.getElementById("form_register");

form_register.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form_register);
  if (formData.get("password") == formData.get("confirmPassword")) {
    alert("Password matched!");
  } else {
    alert("Password does not match!");

    const { data, error } = await supabase.auth.signUp({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    console.log(data);
    console.log(error);
  }
};
