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

// Save user data in Firestore
export const addUserToFirestore = async (user, formData = null) => {
  const rollNumber = await generateUniqueRollNo();

  const userData = {
    uid: user.uid,
    email: user.email,
    name: formData
      ? `${formData.firstName} ${formData.lastName}`.trim()
      : user.displayName || "No Name",
    phone: formData?.phone || "",
    rollNumber,
    address: {
      houseno: "",
      streetno: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    time: Timestamp.now(),
  };

  const userRef = doc(fireDB, "users", user.uid);
  await setDoc(userRef, userData);
};
