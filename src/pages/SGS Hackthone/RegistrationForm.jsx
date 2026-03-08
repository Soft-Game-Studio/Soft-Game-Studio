import { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import { X, CheckCircle, Users } from 'lucide-react';

export default function RegistrationForm({ eventId, onClose }) {
  const [form, setForm] = useState({
    firstName: '',
    teamName: '', // new field
    courseSemester: '',
    college: '',
    age: '',
    mobile: '',
    email: '',
    addressLine: '',
    cityVillage: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(fireDB, 'event_registrations'), {
      ...form,
      eventId, // store the event's document ID (slug)
      createdAt: Timestamp.now()
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You have successfully registered for this event.
            </p>
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-6 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Event Registration</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Users className="w-5 h-5" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="Full Name *"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                name="teamName"
                placeholder="Team Name (if applicable)"
                value={form.teamName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                name="courseSemester"
                placeholder="Course & Semester *"
                value={form.courseSemester}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                name="college"
                placeholder="College / University *"
                value={form.college}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                name="age"
                type="number"
                placeholder="Age *"
                value={form.age}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                name="mobile"
                placeholder="Mobile Number *"
                value={form.mobile}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none md:col-span-2"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t border-gray-200 dark:border-neutral-800 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-700 dark:text-purple-300">Address</h3>
            <div className="space-y-4">
              <input
                name="addressLine"
                placeholder="Address Line *"
                value={form.addressLine}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="cityVillage"
                  placeholder="City / Village *"
                  value={form.cityVillage}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  name="state"
                  placeholder="State *"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  name="pincode"
                  placeholder="Pincode *"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  name="country"
                  placeholder="Country *"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition shadow-lg"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}