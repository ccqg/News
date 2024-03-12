// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// Show the wrapper after the page has fully loaded

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wtstajjtiaocfyttavbm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0c3Rhamp0aWFvY2Z5dHRhdmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3NjcxMzksImV4cCI6MjAyNTM0MzEzOX0.O0EVGa9iUgkNNtQR03T4yn9qfo3-vNnHuaj2gegKdDU"
);
export { supabase };
