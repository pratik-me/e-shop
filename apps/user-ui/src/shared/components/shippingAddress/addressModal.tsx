import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react"; // Assuming you are using lucide-react for icons
import { useForm } from "react-hook-form";
import { countries } from "apps/user-ui/src/configs/countries";

export default function AddressModal({ setShowModal, onSubmit }: any) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      label: "Home",
      name: "",
      street: "",
      city: "",
      zip: "",
      country: "India",
      isDefault: "Set as Default",
    },
  });

  // State to manage our custom dropdown
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const [isPreferenceOpen, setIsPreferenceOpen] = useState(false);
  const selectedLabel = watch("label");
  const selectedPreference = watch("isDefault");

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
      <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add New Address</h3>
          <p className="text-sm text-gray-500 mt-1">
            Enter your shipping or billing information below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* CUSTOM DROPDOWN: Address Label */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Label
            </label>

            <div
              onClick={() => setIsLabelOpen(!isLabelOpen)}
              className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 cursor-pointer bg-white flex justify-between items-center transition-all ${
                isLabelOpen
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <span>{selectedLabel}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isLabelOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Option Menu */}
            {isLabelOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-1.5 flex flex-col gap-1">
                {["Home", "Work", "Other"].map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setValue("label", option);
                      setIsLabelOpen(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer rounded-md transition-colors ${
                      selectedLabel === option
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              placeholder="John Doe"
              {...register("name", { required: "Name is required" })}
              className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.name?.message}
              </p>
            )}
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Street Address
            </label>
            <input
              placeholder="123 Innovation Drive"
              {...register("street", { required: "Street is required" })}
              className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.street
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.street?.message}
              </p>
            )}
          </div>

          {/* City & ZIP (Side-by-Side Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City
              </label>
              <input
                placeholder="San Francisco"
                {...register("city", { required: "City is required" })}
                className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.city
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">
                  {errors.city?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ZIP Code
              </label>
              <input
                placeholder="94105"
                {...register("zip", { required: "ZIP Code is required" })}
                className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.zip
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.zip && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">
                  {errors.zip?.message}
                </p>
              )}
            </div>
          </div>

          {/* Country & Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Country
              </label>
              <select
                {...register("country")}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Preference
              </label>
              <div
              onClick={() => setIsPreferenceOpen(!isPreferenceOpen)}
              className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 cursor-pointer bg-white flex justify-between items-center transition-all ${
                isPreferenceOpen
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <span>{selectedPreference}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isPreferenceOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Option Menu */}
            {isPreferenceOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-1.5 flex flex-col gap-1">
                {["Set as Default", "Not Default"].map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setValue("isDefault", option);
                      setIsPreferenceOpen(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer rounded-md transition-colors ${
                      selectedPreference === option
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
              {/* <select
                {...register("isDefault")}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              >
                <option value="true">Set as Default</option>
                <option value="false">Not Default</option>
              </select> */}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
