import React from "react";

export interface CustomButtonProps {
  title?: string;
}

const CustomButton = ({ title }: CustomButtonProps) => {
  return (
    <div>
      <button className="text-lg bg-blue-500 hover:bg-blue-700 m-5 text-white font-bold py-2 px-4 rounded">
        {title ?? "Click me"}
      </button>
    </div>
  );
};

export default CustomButton;
