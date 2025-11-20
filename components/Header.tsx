import React from 'react';
import { Sprout, Bell } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, userEmail, setUserEmail }) => {
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [tempEmail, setTempEmail] = React.useState(userEmail);

  const handleEmailSave = () => {
    setUserEmail(tempEmail);
    setIsEditingEmail(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-earth-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center text-leaf-600">
            <Sprout size={24} />
          </div>
          <h1 className="text-2xl font-semibold text-earth-800 tracking-tight">
            Leaf<span className="text-leaf-500">Link</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
           {isEditingEmail ? (
             <div className="flex items-center gap-2 bg-earth-50 px-3 py-1.5 rounded-full border border-earth-200 animate-in fade-in slide-in-from-right-4">
               <input 
                 type="email" 
                 value={tempEmail}
                 onChange={(e) => setTempEmail(e.target.value)}
                 placeholder="email@example.com"
                 className="bg-transparent border-none outline-none text-sm text-earth-600 placeholder-earth-400 w-32 sm:w-48"
               />
               <button 
                 onClick={handleEmailSave}
                 className="text-xs bg-leaf-500 text-white px-3 py-1 rounded-full hover:bg-leaf-600 transition-colors"
               >
                 Save
               </button>
             </div>
           ) : (
             <button 
               onClick={() => setIsEditingEmail(true)}
               className="flex items-center gap-2 text-sm text-earth-500 hover:text-leaf-600 transition-colors px-3 py-1.5 rounded-full hover:bg-leaf-50"
             >
               <Bell size={16} />
               <span className="hidden sm:inline">{userEmail ? `Reminders sent to ${userEmail}` : 'Set reminder email'}</span>
             </button>
           )}

          <button
            onClick={onAddClick}
            className="bg-leaf-500 hover:bg-leaf-600 text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-leaf-200 active:scale-95 whitespace-nowrap"
          >
            + Add Plant
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;