"use client";

import { useContext, useEffect, useState, useCallback, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "@/context/DoctorContext";
import { AppContext } from "@/context/AppContext";

export type MedicineFrequency = "Once" | "Twice" | "Thrice" | "As Needed";
export type MedicineForm = "Tablet" | "Capsule" | "Syrup" | "Injection" | "Other";
export type MedicineTiming = "Before Food" | "After Food" | "With Food";

interface Medicine {
  name: string;
  dosage: string;
  frequency: MedicineFrequency;
  form: MedicineForm;
  timing: MedicineTiming;
  duration?: string;
  durationDays?: number;
  instructions?: string;
}

interface PrescriptionItem {
  _id: string;
  appointmentId: {
    _id: string;
    slotDate: string;
    slotTime: string;
    userData?: { name: string; email: string };
  } | string;
  patientId: { name: string; email: string } | string;
  medicines: Medicine[];
  diagnosis?: string;
  doctorNotes?: string;
  instructions?: string;
  notes?: string;
  prescriptionDate: string;
  validUntil?: string;
  status: string;
}

export default function DoctorPrescriptionsPage() {
  const { dToken, appointments, getAppointments, backendUrl } = useContext(DoctorContext);
  const { slotDateFormat } = useContext(AppContext);

  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State for New Prescription
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      name: "",
      dosage: "",
      frequency: "Twice",
      form: "Tablet",
      timing: "After Food",
      durationDays: 5,
      instructions: "",
    },
  ]);

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + "/api/prescriptions", {
        headers: { dtoken: dToken },
      });
      if (data.success && data.prescriptions) {
        setPrescriptions(data.prescriptions);
      }
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, dToken]);

  useEffect(() => {
    if (dToken) {
      fetchPrescriptions();
      getAppointments();
    }
  }, [dToken, fetchPrescriptions, getAppointments]);

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        name: "",
        dosage: "",
        frequency: "Twice",
        form: "Tablet",
        timing: "After Food",
        durationDays: 5,
        instructions: "",
      },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length <= 1) return;
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = <K extends keyof Medicine>(
    index: number,
    field: K,
    value: Medicine[K]
  ) => {
    setMedicines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleCreatePrescription = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedAppointmentId) {
      toast.error("Please choose an appointment");
      return;
    }

    const invalid = medicines.some((m) => !m.name.trim() || !m.dosage.trim());
    if (invalid) {
      toast.error("Please fill in Medicine Name and Dosage for all rows");
      return;
    }

    try {
      setSubmitting(true);
      const formattedMedicines = medicines.map((m) => ({
        name: m.name.trim(),
        dosage: m.dosage.trim(),
        frequency: m.frequency,
        form: m.form,
        timing: m.timing,
        duration: m.duration || `${m.durationDays || 5} days`,
        instructions: m.instructions?.trim() || "",
      }));

      const payload: Record<string, unknown> = {
        appointmentId: selectedAppointmentId,
        medicines: formattedMedicines,
        diagnosis: diagnosis.trim(),
        doctorNotes: notes.trim(),
        instructions: notes.trim(),
      };
      if (validUntil) {
        payload.validUntil = validUntil;
      }

      const { data } = await axios.post(backendUrl + "/api/prescriptions", payload, {
        headers: { dtoken: dToken },
      });

      if (data.success) {
        toast.success("Prescription generated successfully");
        setIsModalOpen(false);
        // Reset form
        setSelectedAppointmentId("");
        setDiagnosis("");
        setNotes("");
        setValidUntil("");
        setMedicines([
          {
            name: "",
            dosage: "",
            frequency: "Twice",
            form: "Tablet",
            timing: "After Food",
            durationDays: 5,
            instructions: "",
          },
        ]);
        fetchPrescriptions();
      } else {
        toast.error(data.message || "Failed to create prescription");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating prescription";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="m-5 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Prescription Management
          </h1>
          <p className="text-sm text-gray-500">
            Write digital prescriptions, configure medication schedules, and review patient medical histories.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-5 py-2.5 rounded-full cursor-pointer transition-colors shadow-sm self-start sm:self-auto"
        >
          + Write New Prescription
        </button>
      </div>

      {/* Prescription List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No prescriptions created yet. Click &quot;+ Write New Prescription&quot; to issue one.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {prescriptions.map((rx) => {
              const appointmentInfo =
                typeof rx.appointmentId === "object" ? rx.appointmentId : null;
              const patientInfo =
                typeof rx.patientId === "object" ? rx.patientId : null;

              return (
                <div key={rx._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-gray-800 text-base">
                          {patientInfo?.name || appointmentInfo?.userData?.name || "Patient"}
                        </h2>
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2.5 py-0.5 rounded-full border border-indigo-100">
                          {rx.status || "ACTIVE"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Prescribed on: {new Date(rx.prescriptionDate).toLocaleDateString()}
                        {appointmentInfo?.slotDate &&
                          ` • Appt: ${slotDateFormat(appointmentInfo.slotDate)}`}
                      </p>
                    </div>

                    {rx.diagnosis && (
                      <span className="text-xs text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-lg">
                        Diagnosis: {rx.diagnosis}
                      </span>
                    )}
                  </div>

                  {/* Medicines List */}
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Medications:</p>
                    <div className="space-y-1">
                      {rx.medicines?.map((med, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-2 text-gray-600">
                          <span className="font-medium text-gray-800">• {med.name}</span>
                          <span className="text-gray-400">({med.dosage})</span>
                          <span className="bg-white border px-1.5 py-0.5 rounded text-[11px] text-gray-500">
                            {med.form}
                          </span>
                          <span className="bg-white border px-1.5 py-0.5 rounded text-[11px] text-indigo-600 font-medium">
                            {med.frequency}
                          </span>
                          <span className="text-gray-400">
                            {med.timing}
                          </span>
                          {med.duration && (
                            <span className="text-gray-400">for {med.duration}</span>
                          )}
                          {med.instructions && (
                            <span className="italic text-gray-500">— {med.instructions}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {(rx.doctorNotes || rx.notes || rx.instructions) && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Doctor Advice: &quot;{rx.doctorNotes || rx.notes || rx.instructions}&quot;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Write Prescription */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                Write Medical Prescription
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-4 mt-4 text-sm">
              {/* Select Appointment */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select Patient Appointment *
                </label>
                <select
                  required
                  value={selectedAppointmentId}
                  onChange={(e) => setSelectedAppointmentId(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose an appointment --</option>
                  {appointments.map((appt) => (
                    <option key={appt._id} value={appt._id}>
                      {appt.userData?.name || "Patient"} — {slotDateFormat(appt.slotDate)} at {appt.slotTime}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Diagnosis / Condition
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acute Bronchitis, Seasonal Allergies"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Medicines Builder */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Medicines & Dosing Schedule *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    + Add Another Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {medicines.map((med, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
                        <span>Medicine #{index + 1}</span>
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(index)}
                            className="text-red-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Drug Name (e.g. Amoxicillin)"
                          value={med.name}
                          onChange={(e) =>
                            handleMedicineChange(index, "name", e.target.value)
                          }
                          className="border rounded-lg p-2 text-xs bg-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Dosage (e.g. 500mg, 1 tablet)"
                          value={med.dosage}
                          onChange={(e) =>
                            handleMedicineChange(index, "dosage", e.target.value)
                          }
                          className="border rounded-lg p-2 text-xs bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                          value={med.form}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "form",
                              e.target.value as MedicineForm
                            )
                          }
                          className="border rounded-lg p-1.5 text-xs bg-white"
                        >
                          <option value="Tablet">Tablet</option>
                          <option value="Capsule">Capsule</option>
                          <option value="Syrup">Syrup</option>
                          <option value="Injection">Injection</option>
                          <option value="Other">Other</option>
                        </select>

                        <select
                          value={med.frequency}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "frequency",
                              e.target.value as MedicineFrequency
                            )
                          }
                          className="border rounded-lg p-1.5 text-xs bg-white"
                        >
                          <option value="Once">Once daily</option>
                          <option value="Twice">Twice daily</option>
                          <option value="Thrice">Thrice daily</option>
                          <option value="As Needed">As needed</option>
                        </select>

                        <select
                          value={med.timing}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "timing",
                              e.target.value as MedicineTiming
                            )
                          }
                          className="border rounded-lg p-1.5 text-xs bg-white"
                        >
                          <option value="After Food">After food</option>
                          <option value="Before Food">Before food</option>
                          <option value="With Food">With food</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Duration in days (e.g. 5)"
                          value={med.durationDays || ""}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "durationDays",
                              Number(e.target.value) || undefined
                            )
                          }
                          className="border rounded-lg p-1.5 text-xs bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Special Instructions (e.g. Drink with warm water)"
                          value={med.instructions || ""}
                          onChange={(e) =>
                            handleMedicineChange(index, "instructions", e.target.value)
                          }
                          className="border rounded-lg p-1.5 text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Advice / Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  General Advice & Doctor Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Rest for 3 days, drink plenty of fluids, avoid cold beverages."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Valid Until (Optional)
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="border rounded-lg p-2 text-xs bg-white"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-full text-xs font-semibold cursor-pointer shadow-sm"
                >
                  {submitting ? "Issuing Prescription..." : "Issue Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
