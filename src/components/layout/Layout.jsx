import React, { Fragment, useContext, use, useState, useEffect } from "react";
import { NavbarMenu } from "../navbar/Navbar";
import Footer from "../footer/Footer";




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
      <Footer />
    </div>
  );
}

export default Layout;
