import React from "react";
import { User, Crown, LogOut } from "lucide-react";

const UserProfile = ({ isOpen }) => {
  return (
    <div className="relative mt-10 p-3 rounded-2xl bg-gradient-to-r from-white/80 via-purple-50 to-white/70 shadow-lg backdrop-blur-lg flex items-center gap-4 hover:scale-[1.01] transition-all duration-300">
      {/* Avatar */}
      <div className="relative">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="User Avatar"
          className="w-12 h-12 rounded-full border-2 border-purple-400 shadow-md"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="flex flex-col justify-center text-purple-800">
          <span className="font-semibold text-sm">hello</span>
          <span className="text-xs text-purple-500 flex items-center gap-1">
            {/* <Crown size={12} /> Pro Member */}
          </span>
        </div>
      )}

      {/* Logout Button */}
      {/* {isOpen && (
        <button className="ml-auto px-3 py-1 text-xs rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold flex items-center gap-1 transition-all duration-300">
          <LogOut size={14} />
          Logout
        </button>
      )} */}
    </div>
  );
};

export default UserProfile;
