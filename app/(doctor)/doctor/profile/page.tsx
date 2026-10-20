"use client";

import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "@/context/DoctorContext";
import { AppContext } from "@/context/AppContext";

export default function DoctorProfilePage() {
  const {
    dToken,
    profileData,
    setProfileData,
    getProfileData,
    backendUrl,
  } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken, getProfileData]);

  const updateProfile = async () => {
    if (!profileData) return;

    try {
      setSaving(true);
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error updating profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!profileData) {
    return (
      <div className="m-5 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="m-5 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Doctor Profile</h1>
        <p className="text-sm text-gray-500">
          Manage your clinical identity, availability schedule, and consultation fees.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Doctor Image */}
          <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-xl bg-indigo-50 border overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover"
              src={
                typeof profileData.image === "string"
                  ? profileData.image
                  : "/assets/doc1.png"
              }
              alt={profileData.name}
            />
          </div>

          {/* Details */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {profileData.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-indigo-600 font-medium text-sm">
                  {profileData.speciality}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 text-sm">{profileData.degree}</span>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-1">
                  {profileData.experience}
                </span>
              </div>
            </div>

            {/* About */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                About
              </p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {profileData.about}
              </p>
            </div>

            {/* Consultation Fee */}
            <div className="pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
                Appointment Consultation Fee
              </label>
              {isEdit ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-700 font-semibold">{currency}</span>
                  <input
                    type="number"
                    min="0"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={profileData.fees}
                    onChange={(e) =>
                      setProfileData((prev) =>
                        prev ? { ...prev, fees: Number(e.target.value) } : false
                      )
                    }
                  />
                </div>
              ) : (
                <p className="text-base font-semibold text-gray-800 mt-1">
                  {currency} {profileData.fees}
                </p>
              )}
            </div>

            {/* Clinic Address */}
            <div className="pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
                Clinic Location
              </label>
              {isEdit ? (
                <div className="space-y-2 mt-1.5">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Address Line 1"
                    value={profileData.address?.line1 || ""}
                    onChange={(e) =>
                      setProfileData((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: {
                                ...prev.address,
                                line1: e.target.value,
                              },
                            }
                          : false
                      )
                    }
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Address Line 2"
                    value={profileData.address?.line2 || ""}
                    onChange={(e) =>
                      setProfileData((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: {
                                ...prev.address,
                                line2: e.target.value,
                              },
                            }
                          : false
                      )
                    }
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-1">
                  {profileData.address?.line1}
                  {profileData.address?.line2 && `, ${profileData.address.line2}`}
                </p>
              )}
            </div>

            {/* Availability Checkbox */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  disabled={!isEdit}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  checked={Boolean(profileData.available)}
                  onChange={() =>
                    isEdit &&
                    setProfileData((prev) =>
                      prev ? { ...prev, available: !prev.available } : false
                    )
                  }
                />
                <span className="text-sm font-medium text-gray-700">
                  Currently Available for Patient Bookings
                </span>
              </label>
            </div>

            {/* Edit / Save Action */}
            <div className="pt-4 flex gap-3">
              {isEdit ? (
                <>
                  <button
                    onClick={updateProfile}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-6 py-2 rounded-full cursor-pointer transition-colors shadow-sm"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEdit(false);
                      getProfileData();
                    }}
                    className="border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium px-6 py-2 rounded-full cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2 rounded-full cursor-pointer transition-colors shadow-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
