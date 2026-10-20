"use client";

import { useState, useContext, type FormEvent } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "@/context/AdminContext";
import { assets } from "@/lib/assets";

const SPECIALITIES = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const EXPERIENCE_OPTIONS = [
  "1 Year",
  "2 Year",
  "3 Year",
  "4 Year",
  "5 Year",
  "6 Year",
  "7 Year",
  "8 Year",
  "9 Year",
  "10 Year",
  "11 Year",
  "12 Year",
];

export default function AddDoctorPage() {
  const [docImg, setDocImg] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!docImg) {
      toast.error("Please select a doctor profile picture");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees).toString());
      formData.append("about", about.trim());
      formData.append("speciality", speciality);
      formData.append("degree", degree.trim());
      formData.append(
        "address",
        JSON.stringify({ line1: address1.trim(), line2: address2.trim() })
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message || "Doctor added successfully");
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setFees("");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setAbout("");
      } else {
        toast.error(data.message || "Failed to add doctor");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error adding doctor";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full max-w-5xl">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Add Doctor</h1>
        <p className="text-sm text-gray-500">
          Register a new medical practitioner into the Docify network.
        </p>
      </div>

      <div className="bg-white px-6 sm:px-8 py-8 border border-gray-200 rounded-xl shadow-sm max-h-[82vh] overflow-y-auto">
        {/* Profile Picture Upload */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img" className="cursor-pointer">
            <div className="w-20 h-20 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-colors">
              {docImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="w-full h-full object-cover"
                  src={URL.createObjectURL(docImg)}
                  alt="Doctor Preview"
                />
              ) : (
                <Image
                  src={assets.upload_area}
                  alt="Upload Area"
                  width={40}
                  height={40}
                />
              )}
            </div>
          </label>
          <input
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setDocImg(e.target.files[0]);
              }
            }}
            type="file"
            id="doc-img"
            accept="image/*"
            hidden
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Doctor Photo</p>
            <p className="text-xs text-gray-500">JPG, PNG or WEBP (Max 5MB)</p>
          </div>
        </div>

        {/* 2-Column Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-600">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Full Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                placeholder="Dr. John Doe"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="email"
                placeholder="doctor@example.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="password"
                placeholder="Secure password"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Experience</label>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Consultation Fee</label>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                min="0"
                placeholder="50"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Speciality</label>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SPECIALITIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Education / Degree</label>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                placeholder="MBBS, MD - Medicine"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Clinic / Hospital Address</label>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                placeholder="Address line 1 (e.g. 57th Cross, Richmond)"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                placeholder="Address line 2 (e.g. Circle, Ring Road, London)"
                required
              />
            </div>
          </div>
        </div>

        {/* About Doctor */}
        <div className="mt-6">
          <label className="text-xs font-medium text-gray-700">About Doctor</label>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Write a concise biography and background for the doctor..."
            rows={4}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium px-8 py-2.5 rounded-full text-sm cursor-pointer transition-colors shadow-sm"
          >
            {isSubmitting ? "Adding Doctor..." : "Add Doctor"}
          </button>
        </div>
      </div>
    </form>
  );
}
