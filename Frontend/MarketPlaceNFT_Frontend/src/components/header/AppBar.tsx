import type { FC } from "react";
import type { ReactNode } from "react";
import { LuMenu } from "react-icons/lu";
import NetworkSwitcher from "../network/NetworkSwitcher";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './style.css';

interface AppBarProps {
  children?: ReactNode;
}

interface UserInfo {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export const AppBar: FC<AppBarProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: UserInfo = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Lỗi parse user từ localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowLogoutConfirm(false); // Đóng dialog sau khi logout
  };

  const openConfirm = () => setShowLogoutConfirm(true);
  const closeConfirm = () => setShowLogoutConfirm(false);

  const menu = [
    { name: "Home", link: "/home" },
    { name: "Marketplace", link: "/product" },
    { name: "Mint", link: "/mint" },
    { name: "Category", link: "/category" },
  ];

  return (
    <div>
      <header id="navbar-sticky" className="navbar">
        <div className="container">
          <nav className="flex justify-between items-center">
            <a href="/" className="logo">
              <img src="assets/images/logo1.png" className="h-10" alt="logo" />
            </a>

            {/* Mobile menu button */}
            <div className="ms-auto flex items-center px-2.5 lg:hidden">
              <button
                className="hs-collapse-toggle bg-default-100/5 inline-flex h-9 w-12 items-center justify-center rounded-md border border-white/20"
                type="button"
                data-hs-collapse="#mobileMenu"
                data-hs-type="collapse"
              >
                <LuMenu className="stroke-white" />
              </button>
            </div>

            {/* Desktop Menu */}
            <div
              className="hs-collapse mx-auto mt-2 hidden grow basis-full items-center justify-center transition-all duration-300 lg:mt-0 lg:flex lg:basis-auto"
              id="mobileMenu"
            >
              <ul id="navbar-navlist" className="navbar-nav">
                {menu.map((item, index) => (
                  <li className="nav-item" key={index}>
                    <NavLink
                      to={item.link}
                      className={({ isActive }) =>
                        `nav-link${isActive ? " active" : ""}`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <NetworkSwitcher />

            {/* Right side: Login / User Info */}
            <div className="ml-4 flex items-center gap-3">
              {!user ? (
                <NavLink to="/login" className="btn-login">
                  Login
                </NavLink>
              ) : (
                <div className="flex items-center gap-4">
                  <div className={`font-bold ${user ? 'username-glow' : 'text-purple-400'}`}>
                    {/* <span className="hidden sm:inline">Welcome,</span> */}
                    <span className="font-semibold text-purple-400">
                      {user.username}
                    </span>
                  </div>

                  {/* Nút Logout */}
                  <button
                    onClick={openConfirm}
                    className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Confirm Dialog - hiện khi bấm Logout */}
      {/* Confirm Dialog với hiệu ứng shake khi bấm No */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="confirm-dialog bg-gray-900 border border-purple-500/50 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl shadow-purple-500/20 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Confirm Logout
            </h3>
            <p className="text-gray-300 text-center mb-8">
              Do you want to logout?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  const dialog = document.querySelector('.confirm-dialog');
                  dialog?.classList.add('shake');
                  setTimeout(() => {
                    dialog?.classList.remove('shake');
                    closeConfirm();
                  }, 600);
                }}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};