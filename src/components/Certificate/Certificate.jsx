import React, { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import JD from "../../Assictes/JD.png";
import LG from "../../Assictes/LG.png";
import SK from "../../Assictes/SK.png";
import Cer from "../../Assictes/Certificate.png"
import company from "../../Assictes/23.png"
import msme from "../../Assictes/msme.png"
const Certificate = ({
  name = "Livesh Garg ",
  rollNumber = "250001 ",
  examName = "JavaScript Basics",
  date = "01-01-2025",
  language = "English",
  score = "80",
  Que = "100",
  certificateNo = "SGSCIF0001"
}) => {
  const printRef = useRef();

  const percentage = ((score / Que) * 100).toFixed(2);

  const handleDownload = async () => {
    const element = printRef.current;

    if (!element) {
      console.error("Certificate element not found");
      return;
    }

    try {
      const clone = element.cloneNode(true);

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "1123px";
      container.style.height = "794px";
      container.style.backgroundColor = "#0f172a";
      container.style.overflow = "hidden";

      clone.style.width = "1123px";
      clone.style.height = "794px";

      container.appendChild(clone);
      document.body.appendChild(container);

      const images = clone.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.src.includes("firebasestorage")) {
            img.crossOrigin = "anonymous";
          }
          return new Promise((resolve) => {
            if (img.complete && img.naturalHeight !== 0) return resolve();
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      clone.style.transform = "none";
      clone.style.transformOrigin = "top left";

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f172a",
        width: clone.offsetWidth,
        height: clone.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1123, 794],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);
      pdf.save("certificate.pdf");

      alert("🎉 Certificate downloaded successfully!");

      document.body.removeChild(container);
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Download failed. Please try again. Error: ${error.message || error}`);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 sm:p-10">
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={handleDownload}
          className=" text-white font-semibold px-8 py-3 rounded-lg transition bg-purple-400"
          
        >
          Download Certificate
        </button>
      </div>

     
      {/* Certificate Preview Area */}
      <div className="overflow-scroll w-screen md:w-full">
        <div
          ref={printRef}
          className="relative w-[1123px] h-[794px] bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${Cer})` }}>
          <div className="  certificate relative w-full h-full  text-black  p-12 sm:p-16 rounded-lg ">
           <div className="absolute bottom-8 right-8 w-32 h-auto">
        <img src={msme} alt="" />
      </div>




            {/* Certificate Text */}
            <div className="text-center px-4 sm:px-20">
            <div className="flex flex-col text-center items-center justify-center">
             
              <strong className="font-bold text-2xl font-serif text-gray-900">SOFT GAME STUDIO</strong>
             </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-2">
                CERTIFICATE
              </h1>
              <h2 className="text-xl sm:text-2xl text-black tracking-widest mb-4">
                OF APPRECIATION
              </h2>
             
              <p className="uppercase tracking-wider text-sm text-black mt-4">
                Presented To
              </p>
              <h3 className="text-3xl sm:text-4xl font-bold border-b-2 border-yellow-500 inline-block px-6 py-4 mt-2 font-serif italic">
                {name}
              </h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-evenly text-center">
 <p><strong>Roll No.:</strong> {rollNumber}</p>
        <p><strong>Certificate No.:</strong> {certificateNo}</p>
        <p><strong>Grade:</strong> {score}/{Que} ({percentage}%)</p>
       
                </div>
        <br />
      </div>

      <p className="mt-2 ml-32 mr-32">
        This certificate is proudly awarded for successfully completing the&nbsp;
        <strong className="text-black">{examName}</strong> in&nbsp;
        <strong className="text-black">{language}</strong> Quiz Competition, conducted by&nbsp;
        <strong className="text-black">Soft Game Studio</strong>.
      </p>

      
      <p className="mt-2 ml-28 mr-28">
        Your achievement highlights not only your strong grasp of the subject matter but also your outstanding dedication, focus, and perseverance.
        We commend your hard work, resilience, and passion for continuous learning. This accomplishment stands as a testament to your commitment
        to excellence and your determination to succeed.
      </p>

             

            </div>

            {/* Signatures */}
            <div className="flex justify-center space-x-16 mt-16 text-center items-end flex-wrap mb-8 ">
              <div>
                <img src={LG} alt={LG} className="h-12 mx-auto m-2" />
                <p className="font-medium">Livesh Garg</p>
                <p className="text-sm font-bold text-gray-900">Founder, COO, CTO</p>
              </div>
              <div>
                <img src={JD} alt={JD} className="h-12 mx-auto m-2 " />
                <p className="font-medium">Jatin Dua</p>
                <p className="text-sm font-bold text-gray-900">Co-Founder, CFO</p>
              </div>
              <div>
                <img src={SK} alt={SK} className="h-12 mx-auto m-2 " />
                <p className="font-medium">Sharik Hasan</p>
                <p className="text-sm font-bold text-gray-900">Co-Founder, CEO, CMO</p>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-sm text-black">
              Date of Completion: {date}
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
              <strong className="text-xs text-black">License No.: UDYAM-PB-06-0032977/85499</strong>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
