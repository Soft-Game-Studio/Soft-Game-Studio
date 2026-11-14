import {
  doc,
  setDoc,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { fireDB } from "../DataBase/firebaseConfig"; // Adjust the import path if needed

// Generate roll number starting from 250001
const generateUniqueRollNo = async () => {
  const currentYearShort = new Date().getFullYear().toString().slice(-2); // '25'
  const prefix = `SGS${currentYearShort}`;
  const counterRef = doc(fireDB, 'counters', `roll_numbers_${currentYearShort}`);

  try {
    const rollNumber = await runTransaction(fireDB, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      const lastNumber = counterDoc.exists() ? counterDoc.data().lastNumber : 0;
      const newNumber = lastNumber + 1;

      // Save the new counter
      transaction.set(counterRef, { lastNumber: newNumber }, { merge: true });

      // Return formatted roll number like SGS250001
      return `${prefix}${String(newNumber).padStart(4, '0')}`;
    });

    return rollNumber;

    
  } catch (error) {
    console.error("Roll number generation failed:", error);
    throw new Error("Failed to generate roll number");
  }
};

// Save user data and DPDP Act 2023 compliant Consent Artefact in Firestore
export const addUserToFirestore = async (user, formData = null) => {
  const rollNumber = await generateUniqueRollNo();

  const isMinor = Boolean(formData?.isMinor);
  const userAge = formData?.age ? Number(formData.age) : null;

  const userData = {
    uid: user.uid,
    email: user.email,
    name: formData
      ? `${formData.firstName} ${formData.lastName}`.trim()
      : user.displayName || "No Name",
    phone: formData?.phone || "",
    rollNumber,
    age: userAge,
    isMinor,
    parentConsentVerified: Boolean(formData?.parentConsent),
    address: {
      houseno: "",
      streetno: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    consentStatus: "GRANTED",
    consentTimestamp: Timestamp.now(),
    time: Timestamp.now(),
  };

  const userRef = doc(fireDB, "users", user.uid);
  await setDoc(userRef, userData);

  // Generate Immutable Consent Artefact (DPDP Act Section 6 & MeitY BRD)
  try {
    const consentId = `ca_${user.uid}_${Date.now()}`;
    const consentRef = doc(fireDB, "consent_artefacts", consentId);
    await setDoc(consentRef, {
      consent_id: consentId,
      data_principal_uid: user.uid,
      purpose_spec_uri: [
        "purpose:auth_service_v1",
        "purpose:exam_cert_v1",
        "purpose:support_crm_v1",
      ],
      notice_version: "v2026.1_DPDPA_8th_Schedule",
      language: "en",
      status: "GRANTED",
      is_minor: isMinor,
      parental_consent_verified: Boolean(formData?.parentConsent),
      timestamp: Timestamp.now(),
      created_at_iso: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[DPDP Audit] Consent artefact ledger write warning:", err);
  }
};
