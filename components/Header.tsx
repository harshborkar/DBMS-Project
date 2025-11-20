import React from 'react';
import { Sprout, LogOut, User } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
  userEmail: string;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, userEmail, onSignOut }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-earth-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center text-leaf-600 shadow-sm">
            <Sprout size={24} />
          </div>
          <h1 className="text-2xl font-semibold text-earth-800 tracking-tight">
            Leaf<span className="text-leaf-500">Link</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-earth-500 bg-earth-50 px-3 py-1.5 rounded-full border border-earth-100">
              <User size={14} />
              <span className="font-medium text-earth-600">{userEmail}</span>
            </div>
          )}

          <button
            onClick={onAddClick}
            className="bg-leaf-500 hover:bg-leaf-600 text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-leaf-200 active:scale-95 whitespace-nowrap flex items-center gap-2"
          >
            <Sprout size={16} className="hidden sm:block" />
            Add Plant
          </button>

          <button
            onClick={onSignOut}
            className="p-2.5 rounded-full text-earth-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;