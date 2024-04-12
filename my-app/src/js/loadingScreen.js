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
  