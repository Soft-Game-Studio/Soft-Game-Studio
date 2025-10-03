import React from 'react'
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

 function DashBoard() {

  const tabs = [
    {
      title: "Exams",
      details: [
        "Create New Exam",
        "Manage Exams",
        "View User Answers",
      ],
      link: "/Admin-Exam"
    },
    {
      title: "Users Data ",
      details: [
        "View All Users",
        "Edit User Details",
      ],
      link: "/Admin-UserData"
    },
     {
      title: "Users Orders ",
      details: [
        "View All Orders",
        "Manage Orders",
        "Export Order Data",
      ],
      link: "/Admin-Orders"
    },
    {
      title: "Products", 
      details: [
        "Add New Product",
        "Edit Existing Products",
        "View All Products",
        "Delete Products",
      ],
      link: "/Admin-Products"
    },
    {
      title: "Notes & Books", 
      details: [
        "Uplode Notes",
        "Uplode Books"
      ],
      link: "/Admin-Notes&Books"
    },
{
      title: "Courses", 
      details: [
        "Add Single Course",
        "Add Play List Course"
      ],
      link: "/Admin-Courses"
    },
    {
      title: "E-Books", 
      details: [
        "Add E books",
        "Ediet E Books"
      ],
      link: "/Admin-EBook"
    },
    {
      title: "SGS Projects", 
      details: [
        "Add SGS Projects",
        "Ediet SGS Projects"
      ],
      link: "/Admin-SGSProjects"
    },
    {
      title: "SGS Members", 
      details: [
        "Add SGS Membres",
        "Ediet SGS Members"
      ],
      link: "/Admin-AddMembr"
    },
    {
      title: "SGS Community Members", 
      details: [
        "Add SGS Community Membres",
        "Ediet SGS Community Members"
      ],
      link: "/Admin-Community-Member"
    },




    



    



    


    

   
    


    

    


    

    
  ];

  return (
    <Layout>
      <section className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 body-font overflow-hidden transition-colors duration-300">
       <div className="container px-5 py-20 mx-auto">
         <h1 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
           Admin Panel
         </h1>
         <div className="flex flex-wrap -m-4 justify-center">
           {tabs.map((tab, index) => (
             <div key={index} className="p-4 xl:w-1/4 md:w-1/2 w-full">
               <div className="h-full p-6 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-all duration-300 flex flex-col relative">
                 <h2 className="text-xs tracking-widest text-gray-500 dark:text-gray-400 mb-1 uppercase font-medium">
                   Admin
                 </h2>
                 <h1 className="text-2xl font-bold text-gray-800 dark:text-white pb-2 mb-4 border-b border-gray-300 dark:border-gray-700 text-center">
                   {tab.title}
                 </h1>
                 <div className="flex-grow space-y-3">
                   {tab.details.map((detail, i) => (
                     <p key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                       <span className="w-6 h-6 mr-3 inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full">
                         <svg
                           fill="none"
                           stroke="currentColor"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth="2.5"
                           className="w-4 h-4"
                           viewBox="0 0 24 24"
                         >
                           <path d="M20 6L9 17l-5-5" />
                         </svg>
                       </span>
                       {detail}
                     </p>
                   ))}
                 </div>
                 <div className="mt-6">
                   <Link to={tab.link}>
                     <button className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-300">
                       View Details
                       <svg
                         className="w-5 h-5 ml-2"
                         fill="none"
                         stroke="currentColor"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         strokeWidth="2"
                         viewBox="0 0 24 24"
                       >
                         <path d="M5 12h14M12 5l7 7-7 7" />
                       </svg>
                     </button>
                   </Link>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
     </section>
    </Layout>
 
  );
};

export default DashBoard;





 




