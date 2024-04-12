// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// Show the wrapper after the page has fully loaded

import { setROuter } from "./router/router";

import { createClient } from "@supabase/supabase-js";

setROuter();

const supabase = createClient(
  "https://jdrbeyywzehkravlqofg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkcmJleXl3emVoa3Jhdmxxb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NDQxNDcsImV4cCI6MjAyODQyMDE0N30.tMjBasfWAavOMjQhhx4gOVIp-Yu6fXu-u2etsXXnZOM"
);


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


  async function doLogout() {
    // Supabase Logout
    let { error } = await supabase.auth.signOut();

    if (error == null) {
      successNotification("Logout Successfully!");
  
      // Clear local Storage
      localStorage.clear();
  
      // Redirect to login page
      window.location.pathname = "/index.html";
    } else {
      errorNotification("Logout Failed!", 15);
    }
  }



  export { supabase,doLogout };