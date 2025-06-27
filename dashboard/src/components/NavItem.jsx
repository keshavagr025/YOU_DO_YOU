import React from "react";

const NavItem = ({ icon, label, open, badge, active, danger }) => {
  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95
        ${
          danger
            ? "text-red-500 hover:bg-red-50/80 hover:shadow-lg"
            : active
            ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 shadow-lg border border-indigo-200/50"
            : "text-gray-600 hover:bg-white/50 hover:shadow-md"
        }`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-xl ${
            active ? "bg-indigo-100" : "bg-gray-100/50"
          } group-hover:bg-white/80 transition-colors duration-200`}
        >
          {icon}
        </div>
        {open && <span className="text-sm font-medium">{label}</span>}
      </div>
      {badge && open && (
        <span className="px-2 py-1 text-xs bg-indigo-500 text-white rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
};

export default NavItem;