// ================= UPDATED PROFESSIONAL BLUE THEME ID CARD WITH COMPANY LOGO BACKGROUND ===================

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import image from "../../Assictes/23.png";
import front from "../../Assictes/IcardF.png";
import bcak from "../../Assictes/IcardB.png";

export default function IDCardModal({ userData, onClose }) {
  const frontCardRef = useRef();
  const backCardRef = useRef();
  const [showFront, setShowFront] = useState(true);


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

 
  const downloadPDF = async () => {
    const front = frontCardRef.current;
    const back = backCardRef.current;

    const oldFront = front.style.transform;
    const oldBack = back.style.transform;

    front.style.transform = "rotateY(0deg)";
    back.style.transform = "rotateY(0deg)";

    await new Promise((r) => setTimeout(r, 150));

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [54, 86],
      });

      const frontImg = await toPng(front, { pixelRatio: 4, backgroundColor: "#fff" });
      const backImg = await toPng(back, { pixelRatio: 4, backgroundColor: "#fff" });

      pdf.addImage(frontImg, "PNG", 0, 0, 54, 86);
      pdf.addPage();
      pdf.addImage(backImg, "PNG", 0, 0, 54, 86);

      pdf.save(`HKS-ID-${userData.employeeId}.pdf`);
    } catch {
      alert("PDF Error! Try again.");
    }

    front.style.transform = oldFront;
    back.style.transform = oldBack;
  };

  if (!userData) return null;

  // =================== COMPANY LOGO BACKGROUND COMPONENT ===================
  const CompanyLogoBackground = ({ isFront = true }) => (
    <div className="absolute inset-0 opacity-[0.08] pointer-events-none overflow-hidden">
      {/* Main centered large logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 flex items-center justify-center">
          <img
            src={image}
            alt="Company Logo"
            className="w-full rounded-full h-full object-contain filter grayscale"
          />
        </div>
      </div>

      {/* Smaller corner logos */}
      <div className="absolute top-6 left-6 w-12 h-12 opacity-40">
        <img src={image} alt="Logo" className="rounded-full w-full h-full object-contain filter grayscale" />
      </div>
      <div className="absolute bottom-6 right-6 w-12 h-12 opacity-40">
        <img src={image} alt="Logo" className="rounded-full w-full h-full object-contain filter grayscale" />
      </div>

      {/* Pattern */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="opacity-10">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1D3557" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );

  // =================== BLUE GRADIENT WAVES ===================
  const BlueWaves = () => (
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <svg width="100%" height="100%">
        <defs>
          <linearGradient id="bluewave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0A1A3C" />
            <stop offset="50%" stopColor="#6A4CFF" />
            <stop offset="100%" stopColor="#1D3557" />
          </linearGradient>
        </defs>
        <circle cx="20%" cy="20%" r="180" fill="url(#bluewave)" opacity="0.6" />
        <circle cx="80%" cy="80%" r="220" fill="url(#bluewave)" opacity="0.4" />
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl p-4 z-50 flex justify-center items-start pt-10 overflow-y-auto">
      <div className="flex flex-col items-center w-full animate-fadeIn max-w-lg">

        {/* CARD FLIP CONTAINER */}
        <div className="mb-8 [perspective:1500px]">

          {/* ================== SQUARE OUTER WRAPPER ADDED HERE ================== */}
          <div
            className={`relative w-[296px] h-[502px] 
              border border-white bg-white p-1 rounded-2xl
              transition-transform duration-700 [transform-style:preserve-3d]
              ${showFront ? "[transform:rotateY(0deg)]" : "[transform:rotateY(180deg)]"}
            `}
          >

            {/* ================= FRONT SIDE ================= */}
            <div
              ref={frontCardRef}
              className={`absolute bg-cover bg-center  inset-0  text-gray-900 
              shadow-2xl overflow-hidden border  rounded-2xl 
              [backface-visibility:hidden] w-full h-full`}
              style={{ backgroundImage: `url(${front})` }}
            >
           
             

              {/* Header */}
              <div className="relative  p-4 text-white text-left ">
                <img
                  src={image}
                  className="absolute left-4 top-5  w-8 h-8 rounded-full border-[0.2px] border-white shadow-xl bg-white"
                  alt="Company"
                />

                <div className="absolute left-14 top-5 flex-col text-left items-center justify-start">
                  <h1 className="text-sm font-bold tracking-wide">Soft Game Studio</h1>
                  <p className="text-[9px] opacity-90">Immersive Digital Innovation</p>
                </div>
              </div>
              {/* Profile */}
              <div className="flex justify-center mt-9 relative z-10">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-[#004AAD] bg-white">
                  <img src={userData.photoUrl || "/default-avatar.png"} className="w-full h-full object-cover" alt="Profile" />
                </div>
              </div>

              {/* DETAILS */}
              <div className="px-4 mt-6 text-xs space-y-3 relative z-10">
                <h1 className="text-xl font-semibold font-serif text-center">{userData.name}</h1>
                <h2 className="text-center text-sm font-serif opacity-80">{userData.role}</h2>
                <Info label="Member ID" value={userData.employeeId} />
                <Info label="Department" value={userData.department} />
                <Info label="Mobile" value={userData.email} />
                <Info label="Member Joined" value={formatDate(userData.createdAt)} />

                
              </div>
             
            </div>

            {/* ================= BACK SIDE ================= */}
            <div
              ref={backCardRef}
              className="absolute bg-cover bg-center  inset-0  text-gray-900 
              shadow-2xl overflow-hidden border  rounded-2xl
              [backface-visibility:hidden] [transform:rotateY(180deg)] w-full h-full"
              style={{ backgroundImage: `url(${bcak})` }}
            >

            
              
              <div className="flex justify-center space-x-1 items-center mt-2  p-4 text-white ">
                <img
                  src={image}
                  className="w-12 h-12 rounded-full border-[0.2px] border-white shadow-xl bg-white"
                  alt="Company"
                />

                <div className="flex flex-col text-left justify-start">
                  <h1 className="text-xl font-bold tracking-wide">Soft Game Studio</h1>
                  <p className="text-[12px] opacity-90">Immersive Digital Innovation</p>
                </div>
              </div>
              

    <div className="mt-5 space-y-4 text-xs relative z-10 p-4  rounded-lg shadow-sm">

  {/* TERMS & CONDITIONS */}
  <div>
    <p className="font-bold text-[#1D3557] mb-2">TERMS & CONDITIONS</p>
    <ul className="space-y-1 list-disc list-inside text-[9px]">
      <li>Carry this ID for verification during working hours.</li>
      <li>For official use only; sharing is prohibited.</li>
      <li>Valid for digital membership and internal ID purposes.</li>
      <li>Tampering or misuse is strictly prohibited.</li>
      <li>Report any loss or damage immediately.</li>
      <li>Property of SoftGame Studio; may be revoked anytime.</li>
    </ul>
  </div>

 {/* CONTACT INFORMATION */}
  <div className="space-y-1">
    <p className="font-bold text-[#1D3557]">CONTACT</p>
    <p></p>
    <h3 className="font-semibold text-[#1D3557] text-[10px] border-b pb-1">Phone:  <span>
    98880-15499 / 62834-00770
    </span> </h3>
    
    <h3 className="font-semibold text-[#1D3557] text-[10px] border-b pb-1">Office Address: <span>
      House No. 574, Street No. 5, Nai Abadi, Abohar, Punjab – 152116
    </span> </h3>
    <h3 className="font-semibold text-[#1D3557] text-[10px] border-b pb-1">Email: <span>
    team.softgamestudio@gmail.com
    </span> </h3>
    <h3 className="font-semibold text-[#1D3557] text-[10px] border-b pb-1">Website:  <span>
   softgamestudios.web.app
    </span> </h3>
    
  </div>
  <p className="mt- text-[12px] text-center text-gray-500">© SoftGameStudio</p>





 
</div>


            </div>

          </div>
        </div>

        {/* FLIP BUTTON */}
        <button
          onClick={() => setShowFront(!showFront)}
          className="px-6 py-3 bg-gradient-to-r from-[#0A1A3C] to-[#1D3557] text-white rounded-xl shadow-lg hover:opacity-90 mb-4 transition-all duration-300 hover:scale-105"
        >
          {showFront ? "View Back Side" : "View Front Side"}
        </button>

        {/* DOWNLOAD + CLOSE */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border w-full max-w-md text-center">
          <h3 className="font-semibold text-gray-800 mb-4">Download ID Card</h3>

          <button
            onClick={downloadPDF}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#1D3557] to-[#6A4CFF] text-white rounded-xl shadow-lg mb-3 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Download PDF
          </button>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================== SMALL COMPONENTS =================== */

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1 border-gray-200">
      <span className="text-[#1D3557] font-semibold">{label}</span>
      <span className="font-bold text-gray-900 max-w-[60%] text-right truncate">
        {value}
      </span>
    </div>
  );
}

