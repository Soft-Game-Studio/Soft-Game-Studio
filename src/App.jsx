import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import NotFoundPage from "./pages/NoPage/NoPage";
import UserLogin from "./pages/Registraction/UserLogin";
import UserSignup from "./pages/Registraction/UserSignup";
import UserResetPasswordPage from "./pages/Registraction/UserResetPasword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Privacy from "./pages/CUSTOMER SERVICE/PrivacyPolicy";
import About from "./pages/CUSTOMER SERVICE/About";
import ContactUs from "./pages/CUSTOMER SERVICE/Contact_Us";
import ReturnPolicy from "./pages/CUSTOMER SERVICE/Return Policy";

import TermsAndConditions from "./pages/CUSTOMER SERVICE/TermsAndConditions";

import CopyrightPage from "./pages/CopyrightPage/CopyrightPage";

import ScrollToTop from "./ScrollToTop";
import Cart from "./pages/Cart/Cart";
import ProductsPage from "./pages/Projects/Product";
import FeedbackSection from "./pages/CUSTOMER SERVICE/FeedBackFome";
import FAQItem from "./pages/CUSTOMER SERVICE/FAQs";
import CookiesPolicy from "./pages/CUSTOMER SERVICE/CookiesPolicy";
import OurMembers from "./components/Members/OurMembers";


import { MyProvider } from "./Library/MyContext";

import AboutExam from "./pages/CUSTOMER SERVICE/AboutSGSExam";
import ProductDetailsPage from "./pages/Projects/ProductDetail";

import FreeNotesAndBooks from "./pages/NotesAndBooks/FreeNotesAndBooks.jsx";
import HomePage from "./components/Hero/HeroSection.jsx";

import DisplayCourses from "./pages/Courses/Courses.jsx";
import SingleCourse from "./pages/Courses/SingleCourse.jsx";
import PlayListCourse from "./pages/Courses/PlayListCourse.jsx";
import EbookReader from "./pages/EBook/EBooks.jsx";
import EbookCatalog from "./pages/EBook/DesplayEbboks.jsx";
import DevelopmentPage from "./pages/CUSTOMER SERVICE/AboutDevelopment.jsx";
import ProfilePage from "./pages/Profile/Profile.jsx";

import SupportUs from "./components/Suport US/SuportUS.jsx";


import { useAuth } from "./AuthProvide.jsx";
import SGSProject from "./pages/SGSProject/SGSProject.jsx";

import LoadingSpinner from "./components/Loarding/LoadingSpinner.jsx";


import ExamHomePage from "./Exams/Home.jsx";
import FreeQuizExam from "./Exams/QuizFree/EXAM CONTROLER/QuizExam.jsx";
import FreeQuizDetails from "./Exams/QuizFree/EXAM CONTROLER/ExamDetails.jsx";
import FreeQuizList from "./Exams/QuizFree/Quiz.jsx";
import OfficialQuizList from "./Exams/Quiz/Quiz.jsx";
import OfficialQuizExam from "./Exams/Quiz/EXAM CONTROLER/QuizExam.jsx";
import OfficialQuizDetails from "./Exams/Quiz/EXAM CONTROLER/ExamDetails.jsx";
import WeeklyQuizList from "./Exams/DailyQuiz/DailyQuizList.jsx";
import WeeklyQuiz from "./Exams/DailyQuiz/Exam Control/DailyQuiz.jsx";
import WeeklyQuizDetails from "./Exams/DailyQuiz/Exam Control/DailyQuizDetaisl.jsx";
import QuizList from "./Exams/Quiz.jsx";
import DailyResultsPage from "./Exams/Result/DailyResult.jsx";
import ResultsPage from "./Exams/Result/Result.jsx";
import CommunityMembers from "./components/Members/CommunityMembers.jsx";
import CertificatePage from "./pages/Certiificate/CertificatePage.jsx";
import ProjectDetailsPage from "./pages/SGSProject/SGSProjectDetaisl.jsx";
import GamesListPage from "./pages/App/Gamepage.jsx";
import GamePage from "./pages/App/GamePageDetais.jsx";
import UploadNotes from "./pages/SGSNotes/Uplode Notes/UplodeNotes.jsx";
import Notes from "./pages/SGSNotes/Notes/Notes.jsx";
import NoteDetail from "./pages/SGSNotes/Notes/Notesview.jsx";
import RedirectPage from "./pages/Redirect page/Redirectpage.jsx";
import NoteQuizExam from "./pages/SGSNotes/Notes/NoteQuizExam.jsx";






function App() {
  return (
    <MyProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <Routes>
          {/*  Basic Links  */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/resetpassword" element={<UserResetPasswordPage />} />
          {/* Leagle Documents  */}
          <Route path="/*" element={<NotFoundPage />} />
          <Route path="/CopyrightPage" element={<CopyrightPage />} />
          <Route path="/PrivacyPolicy" element={<Privacy />} />
          <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/About-SGS" element={<About />} />
          <Route path="/About-Exam" element={<AboutExam />} />
          <Route path="/Feedback" element={<FeedbackSection />} />
          <Route path="/FAQs" element={<FAQItem />} />
          <Route path="/CookiesPolicy" element={<CookiesPolicy />} />
          <Route path="/OurMembers" element={<OurMembers />} />
          <Route path="/OurCommunity" element={<CommunityMembers/>} />
          <Route path="/AboutDevelopmet" element={<DevelopmentPage />} />
          <Route path="/SuportUS" element={<SupportUs />} />

          {/*  Product and Roots  */}
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Project" element={<ProductsPage />} />
          <Route path="/Project-Details/:id" element={<ProductDetailsPage />} />
        

          {/* Notes & Books Routes */}
          <Route path="/Notes&Books" element={<FreeNotesAndBooks />} />
          <Route path="/UploadNotes" element={<UploadNotes />} />
          <Route path="/DownloadNotes" element={<Notes />} />
          <Route path="/DownloadNotes/:id" element={<NoteDetail />} />
          <Route path="/NoteQuiz/:id" element={<NoteQuizExam />} />

          {/* Our Corses */}

          <Route path="/OurCourse" element={<DisplayCourses />} />
          <Route path="/SingleCourse/:id" element={<SingleCourse />} />
          <Route path="/PlayListCourse/:id" element={<PlayListCourse />} />

          {/* Our Ebooks */}

          <Route path="/E-Books" element={<EbookCatalog />} />
          <Route path="/E-Books/:id" element={<EbookReader />} />

          {/* User Profile */}

          <Route path="/Profile" element={<ProfilePage />} />

          {/* App Page */}

          <Route path="/game" element={<GamesListPage />} />
          <Route path="/game/:id" element={<GamePage />} />
          

          {/* SGS PROJECT PAGE */}

          <Route path="/SGS-Projects" element={<SGSProject />} />
           <Route path="/SGS-Projects/:id" element={<ProjectDetailsPage />} />

          {/* SGS Exams */}
          <Route path="/SGS-Exam-Home" element={<ExamHomePage/>} />
          <Route path="/SGS-Quiz" element={<QuizList/>} />

           {/* SGS Exams Free */}
          <Route path="/SGS-Quiz-Free" element={<FreeQuizList/>} />
          <Route path="/SGS-Quiz-Free/:id" element={<FreeQuizExam/>} />
          <Route path="/SGS-Details-Free/:id" element={<FreeQuizDetails/>} />

           {/* SGS Exams Weekely */}
          <Route path="/SGS-Quiz-Weekly" element={<WeeklyQuizList/>} />
          <Route path="/SGS-Quiz-Weekly/:id" element={<WeeklyQuiz/>} />
          <Route path="/SGS-Details-Weekly/:id" element={<WeeklyQuizDetails/>} />
          <Route path="/Weekly-Results" element={<DailyResultsPage/>} />

           {/* SGS Exams official */}
          <Route path="/SGS-Quiz-Official" element={<OfficialQuizList/>} />
          <Route path="/SGS-Quiz-Official/:id" element={<OfficialQuizExam/>} />
          <Route path="/SGS-Details-Official/:id" element={<OfficialQuizDetails/>} />
          <Route path="/Official-Results" element={<ResultsPage/>} />

          {/* SGS Exams official */}
          <Route path="/SGS-Exam-Official" element={<FreeQuizList/>} />
          <Route path="/SGS-Exam-Official/:id" element={<FreeQuizExam/>} />
          <Route path="/SGS-Exam-Details-Official/:id" element={<FreeQuizDetails/>} />
          <Route path="/SGSCERT/:rollNumber" element={<CertificatePage/>} />


        </Routes>
        <ToastContainer />
      </Router>
    </MyProvider>
  );
}

export default App;

// user

export const ProtectedRoute = ({ children }) => {
 const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner/>; // ⏳ prevent instant redirect
  }

  return user ? children : <Navigate to="/login" />;
};


