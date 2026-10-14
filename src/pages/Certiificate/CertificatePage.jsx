import React from "react";
import ExamCertificates from "../../Exams/Certificates/ExamCertificates";

/**
 * CertificatePage (Legacy Path Adapter)
 * Delegates rendering directly to the production-grade ExamCertificates component
 * ensuring 100% backward compatibility for existing routes and imports.
 */
const CertificatePage = () => {
  return <ExamCertificates />;
};

export default CertificatePage;