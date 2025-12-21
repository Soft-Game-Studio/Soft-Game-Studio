import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import LG from "../../Assictes/LG.png";
import SK from "../../Assictes/SK.png";
import Cer from "../../Assictes/Certificate 2.png";

const Certificate = ({ userData, onClose }) => {
  const printRef = useRef();

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      let d = date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
      return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
    } catch {
      return "N/A";
    }
  };

  const handleDownload = async () => {
    const element = printRef.current;
    if (!element) return alert("Certificate element not found.");

    try {
      const clone = element.cloneNode(true);

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "561px";
      container.style.height = "397px";
      container.style.backgroundColor = "#0f172a";
      container.style.overflow = "hidden";
561, 397
      clone.style.width = "561px";
      clone.style.height = "397px";

      container.appendChild(clone);
      document.body.appendChild(container);

      const images = clone.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.src.includes("firebasestorage")) img.crossOrigin = "anonymous";
          return new Promise((resolve) => {
            if (img.complete && img.naturalHeight !== 0) return resolve();
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

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
        format: [561, 397],
      });
     

      pdf.addImage(imgData, "PNG", 0, 0, 561, 397);
      pdf.save("certificate.pdf");

      alert("🎉 Certificate downloaded successfully!");
      document.body.removeChild(container);
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Download failed. Please try again. Error: ${error.message || error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl p-4 z-50 flex flex-col lg:flex-row justify-center items-start lg:items-center gap-6 pt-10 lg:pt-0 overflow-y-auto">

      {/* Buttons Card */}
      
    <div className=" flex-col overflow-auto w-full items-center  flex justify-center ">
      <div className="bg-white p-6 mb-5 rounded-2xl shadow-xl border w-full max-w-md text-center ">
        <h3 className="font-semibold text-gray-800 mb-4">Download Certificate</h3>
        <button
          onClick={handleDownload}
          className="w-full px-6 py-3 bg-gradient-to-r from-[#1D3557] to-[#6A4CFF] text-white rounded-xl shadow-lg mb-3 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          Download Certificate
        </button>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
        >
          Close
        </button>
      </div>

  <div
    ref={printRef}
    className="relative w-[561px] h-[397px] bg-no-repeat bg-cover bg-center rounded-lg shadow-xl"
    style={{ backgroundImage: `url(${Cer})` }}
  >
    <div className="certificate relative w-full h-full text-black p-12  rounded-lg">

      {/* Header */}
      <div className="text-center px-2 sm:px-10">
        <h1 className="text-2xl  font-extrabold text-black mb-1">SOFT GAME STUDIO</h1>
        <strong className="font-bold text-sm font-serif text-gray-900">NEW EMPLOYEE JOINING CERTIFICATE</strong>

        {/* Recipient */}
        <p className="uppercase tracking-wider text-xs text-black mt-2">Presented To</p>
        <h3 className="text-2xl  font-bold border-b-2 py-2 border-yellow-500 inline-block px-3  mt-1 font-serif italic">
          {userData.name || "N/A"}
        </h3>

        {/* Certificate Message */}
        <p className="mt-4 mx-6 text-[10px] text-gray-900">
          This certifies that the recipient has officially joined Soft Game Studio as a <strong>{userData.role || "Team Member"}</strong> on <strong>{formatDate(userData.createdAt)}</strong>. Their dedication, professionalism, and commitment to excellence are recognized and appreciated. We look forward to their contributions and growth within the organization.
        </p>
 
      </div>

      {/* Signatures */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center space-x-16 mt-4 text-center items-end mb-4">
        <div>
          <img src={LG} alt="Livesh Garg Signature" className="h-8 mx-auto" />
          <p className="text-[9px] font-bold text-gray-900">Authorized Sign</p>
        </div>
        <div>
          <img src={SK} alt="Sharik Hasan Signature" className="h-8 mx-auto" />
          <p className="text-[9px] font-bold text-gray-900">Verified Sign</p>
        </div>
      </div>

      {/* Footer */}
      
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-[8px] font-bold text-gray-700">
        License No.: UDYAM-PB-06-0032977/85499
      </div>

    </div>
  </div>
</div>

    </div>
  );
};

export default Certificate;
