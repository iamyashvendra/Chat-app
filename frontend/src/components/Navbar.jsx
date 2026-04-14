import { Link } from "react-router-dom";
import { Settings, User, LogOut, MessageSquare } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {

  const { authUser, logout } = useContext(AuthContext);

  return (

    <header className="fixed top-0 left-0 w-full z-40 backdrop-blur-xl bg-black/30 border-b border-white/10">

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}

        <Link to="/" className="flex items-center gap-2 text-white">

          <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <MessageSquare size={18}/>
          </div>

          <h1 className="font-semibold text-lg">
            QuickChat
          </h1>

        </Link>


        {/* Right Menu */}

        {authUser && (

          <div className="flex items-center gap-4 text-white">

            <Link to="/settings" className="flex items-center gap-1 hover:text-violet-400">
              <Settings size={18}/>
              <span className="hidden sm:inline">Settings</span>
            </Link>


            <Link to="/profile" className="flex items-center gap-1 hover:text-violet-400">
              <User size={18}/>
              <span className="hidden sm:inline">Profile</span>
            </Link>


            <button
              onClick={logout}
              className="flex items-center gap-1 hover:text-red-400"
            >
              <LogOut size={18}/>
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>

        )}

      </div>

    </header>

  );
};

export default Navbar;