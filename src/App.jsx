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

import Exam from "./pages/Admin/DashBoards/Exam/Exam";
import AdminCreateQuiz from "./pages/Admin/DashBoards/Exam/Quiz/CreateQuiz";
import EditQuizDetails from "./pages/Admin/DashBoards/Exam/Quiz/EditQuizDetails";
import EditQuizQuestion from "./pages/Admin/DashBoards/Exam/Quiz/EditQuizQuestions";
import ManageQuiz from "./pages/Admin/DashBoards/Exam/Quiz/ManageQuizzes";
import UserAnswers from "./pages/Admin/DashBoards/Exam/Quiz/UserAnswers";
import DashBoard from "./pages/Admin/DashBoard";
import UsersData from "./pages/Admin/DashBoards/User/UserData";
import DashboardOrder from "./pages/Admin/DashBoards/Orders/Orders";
import Product from "./pages/Admin/DashBoards/Products/Product";
import AddProduct from "./pages/Admin/DashBoards/Products/AddProduct";
import UpdateProduct from "./pages/Admin/DashBoards/Products/UpdateProduct";
import { MyProvider } from "./Library/MyContext";
import ExamUplode from "./pages/Admin/DashBoards/Exam/ThuritacalExam.jsx/ExamUplode";
import AboutExam from "./pages/CUSTOMER SERVICE/AboutSGSExam";
import ProductDetailsPage from "./pages/Projects/ProductDetail";
import NotesAndBooks from "./pages/Admin/DashBoards/NotesAndBooks/NotesAndBooks";
import FreeNotesAndBooks from "./pages/NotesAndBooks/FreeNotesAndBooks.jsx";
import HomePage from "./components/Hero/HeroSection.jsx";
import AddCoursePage from "./pages/Admin/DashBoards/Courses/NewCourses.jsx";
import DisplayCourses from "./pages/Courses/Courses.jsx";
import SingleCourse from "./pages/Courses/SingleCourse.jsx";
import PlayListCourse from "./pages/Courses/PlayListCourse.jsx";
import EbookCreator from "./pages/Admin/DashBoards/EBook/EbookCreator.jsx";
import DashBoardEbook from "./pages/Admin/DashBoards/EBook/Ebooks.jsx";
import EditEbook from "./pages/Admin/DashBoards/EBook/EdietEbook.jsx";
import EbookReader from "./pages/EBook/EBooks.jsx";
import EbookCatalog from "./pages/EBook/DesplayEbboks.jsx";
import DevelopmentPage from "./pages/CUSTOMER SERVICE/AboutDevelopment.jsx";
import ProfilePage from "./pages/Profile/Profile.jsx";
import AllCoursesPage from "./pages/Admin/DashBoards/Courses/DisplayCourses.jsx";
import EditCoursePage from "./pages/Admin/DashBoards/Courses/EdietCourses.jsx";

import AdminCreateQuizFREE from "./pages/Admin/DashBoards/Exam/QuizFree/CreateQuiz";
import EditQuizDetailsFREE from "./pages/Admin/DashBoards/Exam/QuizFree/EditQuizDetails";
import EditQuizQuestionFREE from "./pages/Admin/DashBoards/Exam/QuizFree/EditQuizQuestions";
import ManageQuizFREE from "./pages/Admin/DashBoards/Exam/QuizFree/ManageQuizzes";

import AdminCreateQuizDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/CreateQuiz";
import EditQuizDetailsDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/EditQuizDetails";
import EditQuizQuestionDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/EditQuizQuestions";
import ManageQuizDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/ManageQuizzes";
import UserAnswersDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/UserAnswers";
import SGSQuizAppPage from "./pages/App/SGSQUIZAPP.jsx";
import SupportUs from "./components/Suport US/SuportUS.jsx";
import SGSProjectsPage from "./pages/Admin/DashBoards/SGS Projects/SGSProjectsPage.jsx";

import { useAuth } from "./AuthProvide.jsx";
import SGSProject from "./pages/SGSProject/SGSProject.jsx";
import AdminAddMember from "./pages/Admin/DashBoards/Members/Members.jsx";
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
import AdminCommunityMembers from "./pages/Admin/DashBoards/Members/AdminCommunityMembers.jsx";






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

          <Route path="/SGS-Quiz-App" element={<SGSQuizAppPage />} />

          {/* SGS PROJECT PAGE */}

          <Route path="/SGS-Projects" element={<SGSProject />} />

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



          {/*  Admin Routes */}
          <Route
            path="/Admin"
            element={
              <ProtectedRouteForAdmin>
                <DashBoard />
              </ProtectedRouteForAdmin>
            }
          />

          {/*  Admin User */}
          <Route
            path="/Admin-UserData"
            element={
              <ProtectedRouteForAdmin>
                <UsersData />
              </ProtectedRouteForAdmin>
            }
          />
          {/*  Admin Orders */}
          <Route
            path="/Admin-Orders"
            element={
              <ProtectedRouteForAdmin>
                <DashboardOrder />
              </ProtectedRouteForAdmin>
            }
          />
          {/*  Admin Product */}
          <Route
            path="/Admin-Products"
            element={
              <ProtectedRouteForAdmin>
                <Product />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-Products-Add"
            element={
              <ProtectedRouteForAdmin>
                <AddProduct />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-Products-Edit/:id"
            element={
              <ProtectedRouteForAdmin>
                <UpdateProduct />
              </ProtectedRouteForAdmin>
            }
          />

          {/*  Admin Exam */}
          <Route
            path="/Admin-Exam"
            element={
              <ProtectedRouteForAdmin>
                <Exam />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-SGSExam"
            element={
              <ProtectedRouteForAdmin>
                <ExamUplode />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-Quiz-Create"
            element={
              <ProtectedRouteForAdmin>
                <AdminCreateQuiz />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-Quiz-Edit-QuizDetails/:id"
            element={
              <ProtectedRouteForAdmin>
                <EditQuizDetails />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-Quiz-Edit-QuizQuestion/:id"
            element={
              <ProtectedRouteForAdmin>
                <EditQuizQuestion />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-Quiz-Manage"
            element={
              <ProtectedRouteForAdmin>
                <ManageQuiz />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-Quiz-User-Answers"
            element={
              <ProtectedRouteForAdmin>
                <UserAnswers />
              </ProtectedRouteForAdmin>
            }
          />

          {/* Admin Quiz Free */}
          <Route
            path="/Admin-QuizFree-Create"
            element={
              <ProtectedRouteForAdmin>
                <AdminCreateQuizFREE />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-QuizFree-Edit-QuizDetails/:id"
            element={
              <ProtectedRouteForAdmin>
                <EditQuizDetailsFREE />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-QuizFree-Edit-QuizQuestion/:id"
            element={
              <ProtectedRouteForAdmin>
                <EditQuizQuestionFREE />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-QuizFree-Manage"
            element={
              <ProtectedRouteForAdmin>
                <ManageQuizFREE />
              </ProtectedRouteForAdmin>
            }
          />

          {/* Admin Daily Quiz */}

          <Route
            path="/Admin-DailyQuiz-Create"
            element={
              <ProtectedRouteForAdmin>
                <AdminCreateQuizDaily />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-DailyQuiz-Edit-QuizDetails/:id"
            element={
              <ProtectedRouteForAdmin>
                <EditQuizDetailsDaily />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-DailyQuiz-Edit-QuizQuestion/:id"
            element={
              <ProtectedRouteForAdmin>
                <EditQuizQuestionDaily />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-DailyQuizQuiz-Manage"
            element={
              <ProtectedRouteForAdmin>
                <ManageQuizDaily />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-DailyQuizQuiz-User-Answers"
            element={
              <ProtectedRouteForAdmin>
                <UserAnswersDaily />
              </ProtectedRouteForAdmin>
            }
          />

          {/*  Admin Notes & Books */}
          <Route
            path="/Admin-Notes&Books"
            element={
              <ProtectedRouteForAdmin>
                <NotesAndBooks />
              </ProtectedRouteForAdmin>
            }
          />

          {/*  Admin Courses */}
          <Route
            path="/Admin-Courses"
            element={
              <ProtectedRouteForAdmin>
                <AllCoursesPage />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-Courses-Add"
            element={
              <ProtectedRouteForAdmin>
                <AddCoursePage />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-Courses-Ediet/:id"
            element={
              <ProtectedRouteForAdmin>
                <EditCoursePage />
              </ProtectedRouteForAdmin>
            }
          />

          {/*  Admin E Book */}
          <Route
            path="/Admin-EBook"
            element={
              <ProtectedRouteForAdmin>
                <DashBoardEbook />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-EBookADD"
            element={
              <ProtectedRouteForAdmin>
                <EbookCreator />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/Admin-EBookEdiet/:ebookId"
            element={
              <ProtectedRouteForAdmin>
                <EditEbook />
              </ProtectedRouteForAdmin>
            }
          />

          {/*  Admin SGS Project */}
          <Route
            path="/Admin-SGSProjects"
            element={
              <ProtectedRouteForAdmin>
                <SGSProjectsPage />
              </ProtectedRouteForAdmin>
            }
          />

          {/*  Admin Add Member */}
          <Route
            path="/Admin-AddMembr"
            element={
              <ProtectedRouteForAdmin>
                <AdminAddMember />
              </ProtectedRouteForAdmin>
            }
          />
          {/*  Admin Add Member */}
          <Route
            path="/Admin-Community-Member"
            element={
              <ProtectedRouteForAdmin>
                <AdminCommunityMembers />
              </ProtectedRouteForAdmin>
            }  
          />
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

export const ProtectedRouteForAdmin = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner/>; // ⏳ prevent instant redirect
  }

  return isAdmin ? children : <Navigate to="/login" />;
};
