import React from "react";

type DeleteDiscountModal = {
  discount: any;
  onClose: (e: boolean) => void;
  onConfirm?: any;
};

const DeleteDiscountCodeModal = ({
  discount,
  onClose,
  onConfirm,
}: DeleteDiscountModal) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <h3 className="text-xl text-white">Delete Discount Code</h3>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscountCodeModal;
