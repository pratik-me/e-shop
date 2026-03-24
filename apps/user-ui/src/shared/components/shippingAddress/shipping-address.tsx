import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { MapPin, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AddressModal from "./addressModal";

const ShippingAddressSection = () => {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { reset } = useForm({
    defaultValues: {
      label: "Home",
      name: "",
      street: "",
      city: "",
      zip: "",
      country: "India",
      isDefault: "false",
    },
  });

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["shipping-addresses"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/shipping-addresses");
      return res.data.addresses;
    },
  });

  const { mutate: addAddress } = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axiosInstance.post("/api/add-address", payload);
      return res.data.address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] });
      reset();
      setShowModal(false);
    },
  });

  const { mutate: deleteAddress } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/api/delete-address/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] });
    },
  });

  const onSubmit = (data: any) => {
    addAddress({
      ...data,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Saved Addresses</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-sm text-blue-500 font-medium hover:text-blue-700 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      {/* Address List */}
      {isLoading ? (
        <p className="text-sm text-gray-500 ">Loading addresses...</p>
      ) : !addresses || addresses.length === 0 ? (
        <p className="text-sm text-gray-600">No saved addresses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address: any) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-md p-4 relative"
            >
              {address.isDefault && (
                <span className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-center text-xs px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-5 h-5 mt-0.5 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {address.label} - {address.name}
                  </p>
                  <p>
                    {address.street}, {address.city}, {address.zip},{" "}
                    {address.country}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  className="flex items-center gap-1 !cursor-pointer text-xs text-red-600"
                  onClick={() => deleteAddress(address.id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        // <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
        //   <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl relative">
        //     {/* Close Button */}
        //     <button
        //       onClick={() => setShowModal(false)}
        //       className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        //       aria-label="Close modal"
        //     >
        //       <X className="w-5 h-5" />
        //     </button>

        //     {/* Header */}
        //     <div className="mb-6">
        //       <h3 className="text-xl font-bold text-gray-900">
        //         Add New Address
        //       </h3>
        //       <p className="text-sm text-gray-500 mt-1">
        //         Enter your shipping or billing information below.
        //       </p>
        //     </div>

        //     {/* Form */}
        //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        //       {/* Label / Type */}
        //       <div>
        //       <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Label</label>
        //       <select
        //         {...register("label")}
        //         className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        //       >
        //         <option value="Home">Home</option>
        //         <option value="Work">Work</option>
        //         <option value="Other">Other</option>
        //       </select>
        //     </div>

        //       {/* Name */}
        //       <div>
        //         <label className="block text-sm font-medium text-gray-700 mb-1.5">
        //           Name
        //         </label>
        //         <input
        //           placeholder="Jane Doe"
        //           {...register("name", { required: "Name is required" })}
        //           className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
        //             errors.name
        //               ? "border-red-500 focus:ring-red-500"
        //               : "border-gray-300"
        //           }`}
        //         />
        //         {errors.name && (
        //           <p className="text-red-500 text-xs mt-1.5 font-medium">
        //             {errors.name?.message}
        //           </p>
        //         )}
        //       </div>

        //       {/* Street Address */}
        //       <div>
        //         <label className="block text-sm font-medium text-gray-700 mb-1.5">
        //           Street Address
        //         </label>
        //         <input
        //           placeholder="123 Innovation Drive"
        //           {...register("street", { required: "Street is required" })}
        //           className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
        //             errors.street
        //               ? "border-red-500 focus:ring-red-500"
        //               : "border-gray-300"
        //           }`}
        //         />
        //         {errors.street && (
        //           <p className="text-red-500 text-xs mt-1.5 font-medium">
        //             {errors.street?.message}
        //           </p>
        //         )}
        //       </div>

        //       {/* City & ZIP (Side-by-Side Grid) */}
        //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        //         <div>
        //           <label className="block text-sm font-medium text-gray-700 mb-1.5">
        //             City
        //           </label>
        //           <input
        //             placeholder="San Francisco"
        //             {...register("city", { required: "City is required" })}
        //             className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
        //               errors.city
        //                 ? "border-red-500 focus:ring-red-500"
        //                 : "border-gray-300"
        //             }`}
        //           />
        //           {errors.city && (
        //             <p className="text-red-500 text-xs mt-1.5 font-medium">
        //               {errors.city?.message}
        //             </p>
        //           )}
        //         </div>

        //         <div>
        //           <label className="block text-sm font-medium text-gray-700 mb-1.5">
        //             ZIP Code
        //           </label>
        //           <input
        //             placeholder="94105"
        //             {...register("zip", { required: "ZIP Code is required" })}
        //             className={`w-full border px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
        //               errors.zip
        //                 ? "border-red-500 focus:ring-red-500"
        //                 : "border-gray-300"
        //             }`}
        //           />
        //           {errors.zip && (
        //             <p className="text-red-500 text-xs mt-1.5 font-medium">
        //               {errors.zip?.message}
        //             </p>
        //           )}
        //         </div>
        //       </div>

        //       {/* Country & Default Options (Side-by-Side Grid) */}
        //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        //         <div>
        //           <label className="block text-sm font-medium text-gray-700 mb-1.5">
        //             Country
        //           </label>
        //           <select
        //             {...register("country")}
        //             className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        //           >
        //             {countries.map((country) => (
        //               <option key={country} value={country}>
        //                 {country}
        //               </option>
        //             ))}
        //           </select>
        //         </div>

        //         <div>
        //           <label className="block text-sm font-medium text-gray-700 mb-1.5">
        //             Preferences
        //           </label>
        //           <select
        //             {...register("isDefault")}
        //             className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        //           >
        //             <option value="true">Set as Default</option>
        //             <option value="false">Not Default</option>
        //           </select>
        //         </div>
        //       </div>

        //       {/* Actions */}
        //       <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
        //         <button
        //           type="button"
        //           onClick={() => setShowModal(false)}
        //           className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors"
        //         >
        //           Cancel
        //         </button>
        //         <button
        //           type="submit"
        //           className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
        //         >
        //           Save Address
        //         </button>
        //       </div>
        //     </form>
        //   </div>
        // </div>
        <AddressModal
          setShowModal={setShowModal}
          addAddress={addAddress}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

export default ShippingAddressSection;
