import { useMutation } from "@tanstack/react-query";
import { shopCategories } from "apps/seller-ui/src/utils/categories";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  bio: string;
  address: string;
  opening_hours: string;
  website: string;
  category: string;
};

const CreateShop = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const shopCreateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
        data
      );

      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3);
    },
  });

  const onSubmit = async (data: any) => {
    const shopData = { ...data, sellerId };

    shopCreateMutation.mutate(shopData);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Setup new Shop
        </h3>

        <label className="block text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          placeholder="Shop Name"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}

        <label className="block text-gray-700 mb-1">Bio (Max 100 words)</label>
        <input
          type="text"
          placeholder="Shop Bio"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("bio", {
            required: "Shop Bio is required.",
            validate: (value) =>
              countWords(value) <= 100 || "Bio can not exceed 100 words.",
          })}
        />
        {
          errors.bio && <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
        }

        <label className="block text-gray-700 mb-1">Address *</label>
        <input type="text" placeholder="Shop Location" className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1" {...register("address", { required: "Shop address is required." })} />
        {
          errors.address && <p className="text-red-500 text-sm">{String(errors.address.message)}</p>
        }

        <label className="block text-gray-700 mb-1">Opening Hours *</label>
        <input type="text" placeholder="eg., Mon-Fri 8AM - 10PM" className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1" {...register("opening_hours", { required: "Opening hours are required." })} />
        {
          errors.opening_hours && <p className="text-red-500 text-sm">{String(errors.opening_hours.message)}</p>
        }

        <label className="block text-gray-700 mb-1">Website</label>
        <input type="url" placeholder="https://www.example.com" className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1" {...register("website", {
          pattern: {
            value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/,
            message: "Enter a valid URL",
          }
        })} />
        {
          errors.website && <p className="text-red-500 text-sm">{String(errors.website.message)}</p>
        }

        <label className="block text-gray-700 mb-1">Category</label>
        <select className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" {...register("category", { required: "Category is required" })}>
          <option value="">Select a category</option>
          {shopCategories.map(category => (
            <option key={category.value} value={category.value}>{category.label}</option>
          ))}

        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">
            {errors.category.message}
          </p>
        )}

        <button
          type="submit"
          className="w-full text-lg cursor-pointer mt-5 bg-black text-white py-2 rounded-lg"
        >
          Create
        </button>
      </form>
    </>
  );
};

export default CreateShop;
