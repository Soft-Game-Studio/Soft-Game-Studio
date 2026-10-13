import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../../UiComponents/resizable-navbar";
import { useState, useCallback, useRef, useEffect } from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoMdMenu } from "react-icons/io";
import { ImExit, ImEnter } from "react-icons/im";
import { FiSun, FiMoon } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../components/Theems/UseTheems";
import { useAuth } from "../../AuthProvide";
import { auth } from "../../DataBase/firebaseConfig";
import { signOut } from "firebase/auth";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Notes", link: "/DownloadNotes" },
  { name: "Course", link: "/OurCourse" },
  { name: "E-Books", link: "/E-Books" },
  { name: "Games", link: "/game" },
];

export function NavbarMenu() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      setIsMobileMenuOpen(false);
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Logout failed to execute securely.", error);
    }
  };

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Navbar className="m-0 p-0 border-b border-gray-200 dark:border-neutral-800 transition-colors duration-300">
      <NavBody>
        <NavbarLogo aria-label="Company Logo Home" />
        <NavItems items={navItems} />

        <div className="flex justify-center items-center gap-3 relative">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-neutral-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer flex items-center justify-center"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <FiMoon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
            ) : (
              <FiSun className="w-5 h-5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
            )}
          </button>

          {/* Profile / Login Control */}
          {user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-1.5 p-1.5 rounded-lg text-neutral-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                aria-label="User account menu"
              >
                <IoMdMenu className="w-5 h-5" aria-hidden="true" />
                <RiAccountCircleFill className="w-6 h-6 text-neutral-600 dark:text-neutral-300" aria-hidden="true" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg py-1.5 z-50 overflow-hidden">
                  <ul className="flex flex-col m-0 p-0 list-none">
                    <li>
                      <Link
                        to="/Profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-xs font-semibold text-neutral-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <RiAccountCircleFill className="w-4 h-4 mr-2.5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                        Account Profile
                      </Link>
                    </li>
                    <li className="border-t border-gray-100 dark:border-neutral-800 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      >
                        <ImExit className="w-4 h-4 mr-2.5" aria-hidden="true" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-xs"
              aria-label="Navigate to login page"
            >
              Log In
            </Link>
          )}
        </div>
      </NavBody>

      {/* Mobile Navbar Elements */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo aria-label="Company Logo Home" />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-neutral-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <FiMoon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <FiSun className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu}>
          <nav aria-label="Mobile navigation" className="w-full">
            <ul className="flex flex-col gap-1.5 p-2 m-0 list-none w-full">
              {navItems.map((item) => (
                <li key={item.name} className="w-full">
                  <Link
                    to={item.link}
                    className="block px-4 py-2.5 text-sm font-semibold rounded-lg text-neutral-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-full px-2 pt-3 border-t border-gray-100 dark:border-neutral-800">
            {!user ? (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex w-full justify-center items-center py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-gray-200 rounded-xl font-semibold text-xs transition-colors shadow-xs"
              >
                <ImEnter className="w-4 h-4 mr-2" aria-hidden="true" />
                Log In
              </Link>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/Profile");
                    closeMobileMenu();
                  }}
                  className="flex w-full justify-center items-center py-2.5 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl font-semibold text-xs transition-colors text-neutral-800 dark:text-gray-200 cursor-pointer"
                >
                  <RiAccountCircleFill className="w-4 h-4 mr-2 text-neutral-500" aria-hidden="true" />
                  Account Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full justify-center items-center py-2.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                >
                  <ImExit className="w-4 h-4 mr-2" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

export default NavbarMenu;