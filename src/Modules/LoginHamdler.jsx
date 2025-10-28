// src/handlers/loginHandler.js
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../DataBase/firebaseConfig";
import { toast } from "react-toastify";


// ✅ Email/password login
const handleLogin = async (email, password, navigate) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);

    if (result) {
      toast.success("Login successful", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    }
    

  } catch (error) {
    console.error("Login error:", error);
    toast.error("Invalid credentials. Please try again or sign up.");
  }
};

export { handleLogin};
