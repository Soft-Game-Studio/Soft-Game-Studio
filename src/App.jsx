import React, { useEffect,  lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

const NotFoundPage = lazy(() => import("./pages/NoPage/NoPage"));
const UserLogin = lazy(() => import("./pages/Registraction/UserLogin"));
const UserSignup = lazy(() => import("./pages/Registraction/UserSignup"));
const UserResetPasswordPage = lazy(() => import("./pages/Registraction/UserResetPasword"));

const Privacy = lazy(() => import("./pages/CUSTOMER SERVICE/PrivacyPolicy"));
const About = lazy(() => import("./pages/CUSTOMER SERVICE/About"));
const ContactUs = lazy(() => import("./pages/CUSTOMER SERVICE/Contact_Us"));
const ReturnPolicy = lazy(() => import("./pages/CUSTOMER SERVICE/Return Policy"));
const TermsAndConditions = lazy(() => import("./pages/CUSTOMER SERVICE/TermsAndConditions"));
const CopyrightPage = lazy(() => import("./pages/CopyrightPage/CopyrightPage"));

const Cart = lazy(() => import("./pages/Cart/Cart"));
const ProductsPage = lazy(() => import("./pages/Projects/Product"));
const FeedbackSection = lazy(() => import("./pages/CUSTOMER SERVICE/FeedBackFome"));
const FAQItem = lazy(() => import("./pages/CUSTOMER SERVICE/FAQs"));
const CookiesPolicy = lazy(() => import("./pages/CUSTOMER SERVICE/CookiesPolicy"));

const OurMembers = lazy(() => import("./components/Members/OurMembers"));
const AboutExam = lazy(() => import("./pages/CUSTOMER SERVICE/AboutSGSExam"));
const ProductDetailsPage = lazy(() => import("./pages/Projects/ProductDetail"));

const FreeNotesAndBooks = lazy(() => import("./pages/NotesAndBooks/FreeNotesAndBooks.jsx"));
const HomePage = lazy(() => import("./components/Hero/HeroSection.jsx"));

const DisplayCourses = lazy(() => import("./pages/Courses/Courses.jsx"));
const SingleCourse = lazy(() => import("./pages/Courses/SingleCourse.jsx"));
const PlayListCourse = lazy(() => import("./pages/Courses/PlayListCourse.jsx"));

const EbookReader = lazy(() => import("./pages/EBook/EBooks.jsx"));
const EbookCatalog = lazy(() => import("./pages/EBook/DesplayEbboks.jsx"));

const DevelopmentPage = lazy(() => import("./pages/CUSTOMER SERVICE/AboutDevelopment.jsx"));
const ProfilePage = lazy(() => import("./pages/Profile/Profile.jsx"));

const SupportUs = lazy(() => import("./components/Suport US/SuportUS.jsx"));
const SGSProject = lazy(() => import("./pages/SGSProject/SGSProject.jsx"));


const OfficialQuizList = lazy(() => import("./Exams/Quiz/Quiz.jsx"));
const OfficialQuizExam = lazy(() => import("./Exams/Quiz/EXAM CONTROLER/QuizExam.jsx"));
const OfficialQuizDetails = lazy(() => import("./Exams/Quiz/EXAM CONTROLER/ExamDetails.jsx"));

const ResultsPage = lazy(() => import("./Exams/Result/Result.jsx"));

const CommunityMembers = lazy(() => import("./components/Members/CommunityMembers.jsx"));
const CertificatePage = lazy(() => import("./pages/Certiificate/CertificatePage.jsx"));

const ProjectDetailsPage = lazy(() => import("./pages/SGSProject/SGSProjectDetaisl.jsx"));

const GamesListPage = lazy(() => import("./pages/App/Gamepage.jsx"));
const GamePage = lazy(() => import("./pages/App/GamePageDetais.jsx"));

const UploadNotes = lazy(() => import("./pages/SGSNotes/Uplode Notes/UplodeNotes.jsx"));
const Notes = lazy(() => import("./pages/SGSNotes/Notes/Notes.jsx"));
const NoteDetail = lazy(() => import("./pages/SGSNotes/Notes/Notesview.jsx"));
const NoteQuizExam = lazy(() => import("./pages/SGSNotes/Notes/NoteQuizExam.jsx"));

const RedirectPage = lazy(() => import("./pages/Redirect page/Redirectpage.jsx"));

const DynamicEventPage = lazy(() =>
  import("./pages/SGS Hackthone/DynamicEventPage.jsx")
);

const EventsListing = lazy(() =>
  import("./pages/SGS Hackthone/EventsListing.jsx")
);

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./ScrollToTop";
import { MyProvider } from "./Library/MyContext";
import { useAuth } from "./AuthProvide.jsx";
import LoadingSpinner from "./components/Loarding/LoadingSpinner.jsx";



function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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

   
           {/* SGS Exams official */}
          <Route path="/SGS-Quiz-Official" element={<OfficialQuizList/>} />
          <Route path="/SGS-Quiz-Official/:id" element={<OfficialQuizExam/>} />
          <Route path="/SGS-Details-Official/:id" element={<OfficialQuizDetails/>} />
          <Route path="/Official-Results" element={<ResultsPage/>} />
          <Route path="/SGSCERT/:rollNumber" element={<CertificatePage/>} />

          {/* SGS official hackthone */}
          <Route path="/event" element={<EventsListing/>} />
          <Route path="/event/:id" element={<ProtectedRoute><DynamicEventPage/></ProtectedRoute>} />



        </Routes>
        <ToastContainer />
      </Router>
    </MyProvider>
    </Suspense>
 
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


