import Button from "@/components/atoms/Button";
import Loader from "@/components/atoms/Loader";
import { CircularProgress } from "@mui/material";
import React, { useState } from "react";

// PermissionCheck Component
const PermissionCheck = ({
  step,
  title,
  description,
  status,
  isLast,
  button,
}) => {
  const statusStyles = {
    completed: "text-white",
    pending: "text-white",
    error: "text-white",
  };

  return (
    <tr className={` ${!isLast ? "border-b border-gray-500" : ""}`}>
      <td className={`py-2 ${statusStyles[status]}`}>
        <div className="flex gap-x-2 justify-start">
          <div className="flex flex-col">
            <div className="flex items-center justify-center   text-white rounded-full ">
              {status === "completed" ? (
                "✓"
              ) : status === "loading" ? (
                <CircularProgress size={26} />
              ) : (
                "⏳"
              )}
            </div>
          </div>
          <div className="mb-4">
            <p className="mb-2">{title}</p>
            <p className="text-white text-sm">{description}</p>
            {button}
          </div>
        </div>
      </td>
    </tr>
    // <tr className="border-b border-gray-500">
    //   <td className="py-2">
    //     <div className="flex gap-x-2 justify-start">
    //       <div
    //         className={`flex items-center justify-center w-6 h-6 rounded-full ${statusStyles[status]}`}
    //       >
    //         {status === "completed" ? "✓" : "⏳"}
    //       </div>
    //       <div>
    //         <p className="mb-2 text-white">{title}</p>
    //         <p className="text-white text-sm">{description}</p>
    //       </div>
    //     </div>
    //   </td>
    // </tr>
  );
};

export default PermissionCheck;
