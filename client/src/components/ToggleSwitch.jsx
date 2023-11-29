import React from "react";

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="relative inline-block w-12 h-6 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner transition duration-300 ease-in-out">
        <div
          className={`${
            checked ? "translate-x-6 bg-blue-500" : "translate-x-0 bg-white"
          } w-6 h-6 rounded-full shadow-md transform transition duration-300 ease-in-out`}
        ></div>
      </div>
    </label>
  );
}

export default ToggleSwitch;
