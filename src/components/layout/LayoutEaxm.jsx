import React, { Fragment, useContext, use, useState, useEffect } from "react";
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";
import ExamPanelNav from "../../Exams/Common/ExamPanelNav";



function LayoutExam({ children }) {
  return (
    <div className="bg-neutral-950  m-0 p-0 min-h-screen text-neutral-100 ">
      <ExamPanelNav />
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

export default LayoutExam;
