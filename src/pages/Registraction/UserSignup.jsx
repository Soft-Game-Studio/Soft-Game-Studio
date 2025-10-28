import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  auth,
} from "../../DataBase/firebaseConfig";
import { addUserToFirestore } from "../../Modules/signupHandler";
import { Input } from "../../UiComponents/input";
import { Label } from "../../UiComponents/label";
import { cn } from "../../Library/utils";

import { Helmet } from "react-helmet";
import Layout from "../../components/layout/Layout";

export default function UserSignup() {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasCapital: false,
    hasNumber: false,
    hasSymbol: false
  });
  
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    if (id === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const errors = {
      minLength: password.length >= 6,
      hasCapital: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    const isValidPassword = validatePassword(formData.password);
    if (!isValidPassword) {
      setShowPasswordValidation(true);
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.toLowerCase(),
        formData.password
      );
      await addUserToFirestore(userCredential.user, formData);
      navigate("/Login");
    } catch (error) {
      console.error("Email signup failed:", error.message);
    }
  };


  return (
    <Layout>
      <Helmet>
        <title>Sign Up | Soft Game Studio</title>
        <meta
          name="description"
          content="Create a free account on Soft Game Studio to access free and premium projects, courses, exams, and more. Fast and secure registration for students and developers."
        />
        <meta
          name="keywords"
          content="Sign Up, Register, Create Account, Soft Game Studio, Student Registration, Developer Signup, Project Access"
        />
        <meta name="author" content="Soft Game Studio" />

        <meta property="og:title" content="Sign Up | Soft Game Studio" />
        <meta
          property="og:description"
          content="Join Soft Game Studio today. Get access to top-quality projects, coding resources, and exam preparation tools. Quick and easy signup process."
        />
        <meta property="og:url" content="https://softgamestudios.web.app/signup" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
        />
      </Helmet>

      <div className="flex justify-center items-center min-h-screen p-4 bg-purple-100 dark:bg-neutral-950">
        <div className="shadow-input mx-auto w-full max-w-md p-4 rounded-2xl md:p-8 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to Soft Game Studio
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Secure access to your creative journey with Soft Game Studio.
          </p>
          <form className="my-8" onSubmit={handleEmailSignup}>
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <LabelInputContainer>
                <Label htmlFor="firstName" className="text-neutral-700 dark:text-neutral-300">First name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  type="text"
                  className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastName" className="text-neutral-700 dark:text-neutral-300">Last name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  type="text"
                  className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  required
                />
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300">Email Address</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user123@gmail.com"
                type="email"
                className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                required
              />
            </LabelInputContainer>
             <LabelInputContainer className="mb-4">
              <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300">Password</Label>
              <Input
                id="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setShowPasswordValidation(true)}
                placeholder="••••••••"
                type="password"
                className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                required
              />
              
              {/* Password validation checklist */}
              {showPasswordValidation && (
                <div className="mt-2 text-xs">
                  <p className={passwordErrors.minLength ? "text-green-500" : "text-red-500"}>
                    • At least 6 characters
                  </p>
                  <p className={passwordErrors.hasCapital ? "text-green-500" : "text-red-500"}>
                    • Contains a capital letter
                  </p>
                  <p className={passwordErrors.hasNumber ? "text-green-500" : "text-red-500"}>
                    • Contains a number
                  </p>
                  <p className={passwordErrors.hasSymbol ? "text-green-500" : "text-red-500"}>
                    • Contains a symbol
                  </p>
                </div>
              )}
            </LabelInputContainer>
            <LabelInputContainer className="mb-8">
              <Label htmlFor="phone" className="text-neutral-700 dark:text-neutral-300">Phone No.</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9999999999"
                type="tel"
                className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                required
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-purple-500 to-purple-700 dark:from-neutral-800 dark:to-neutral-900 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>
          </form>
          <p className="text-center text-neutral-600 dark:text-neutral-300 text-sm mt-4">
            Already registered?
            <Link
              to="/Login"
              className="text-purple-600 dark:text-red-500 hover:underline font-medium ml-2"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

// Helper components
const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1 w-full", className)}>
    {children}
  </div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-purple-400 dark:via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-purple-500 dark:via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);