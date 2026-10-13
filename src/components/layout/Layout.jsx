import React, { Fragment, useContext, use, useState, useEffect } from "react";
import { NavbarMenu } from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";
import SGSChatWidget from "../Chatbot/SGSChatWidget";



function Layout({ children }) {

  const [showFirstDiv, setShowFirstDiv] = useState(true);
  const toggleDivs = () => {
    setShowFirstDiv(!showFirstDiv);
  }
  return (
    <div className="bg-white dark:bg-neutral-950 m-0 p-0 min-h-screen text-neutral-900 dark:text-neutral-100">
      <NavbarMenu />
      <div className="">
        <div className="content">{children}</div>
      </div>
      {/* <SGSChatWidget
        position="bottom-right"
        showIcon={true}
        initialMessage="Hello! Welcome to Soft Game Studio. How can I assist you today?"
      /> */}
      <Footer />
    </div>
  );
}

export default Layout;
