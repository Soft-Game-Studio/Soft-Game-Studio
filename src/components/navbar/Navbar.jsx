import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../../UiComponents/resizable-navbar";
import { useState, useEffect } from "react";
import { RiAccountCircleFill, RiAdminFill } from "react-icons/ri";
import { IoMdMenu } from "react-icons/io";
import { ImExit, ImEnter } from "react-icons/im";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaCartArrowDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../components/Theems/UseTheems";
import { useAuth } from "../../AuthProvide";
import { auth } from "../../DataBase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useCart } from "../../Modules/Cart/CartContext";


const navItems = [
  { name: "Home", link: "/" },
  { name: "Notes", link: "/Notes&Books" },
  { name: "Course", link: "/OurCourse"},
  { name: "E-Books", link: "/E-Books" },
];

export function NavbarMenu() {
 const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user} = useAuth()
  const {cartItems} = useCart()

  const logout = () => {
   signOut(auth)  
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <Navbar className="m-0 p-0">
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />

        <div className="flex justify-center items-center gap-2 relative">
          <NavbarButton
            onClick={() => navigate("/Cart")}
            className="relative flex items-center justify-center p-2 rounded-full text-neutral-950 dark:text-gray-300 hover:text-cyan-400"
            aria-label="Cart"
          >
            <FaCartArrowDown className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                {cartItems.length}
              </span>
            )}
          </NavbarButton>

          <NavbarButton
            onClick={toggleTheme}
            className="p-2 rounded-full text-neutral-950 dark:text-gray-300 "
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
          </NavbarButton>

          {/* Profile/Login Dropdown */}
          <div className="relative group">
            <NavbarButton className="flex items-center p-1 rounded-full text-neutral-950 dark:text-gray-300   ">
              {user ?  (
                <>
                  <IoMdMenu className="w-4 h-4 mr-2" />
                  <RiAccountCircleFill className="w-6 h-6" />
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm px-2 py-1 hover:scale-110 transform duration-200"
                >
                  Login
                </Link>
              )}
            </NavbarButton>

            {user && (
              <div className="absolute right-0 text-neutral-950 dark:text-gray-300  hidden group-hover:block bg-white dark:bg-neutral-950 w-48 p-2 rounded-md shadow-lg z-50">
                <Link
                  to="/Profile"
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-neutral-900 rounded-full"
                >
                  <RiAccountCircleFill className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-neutral-900 rounded-full"
                >
                  <ImExit className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center space-x-1">
            <NavbarButton
              onClick={() => navigate("/Cart")}
              className="relative p-2 rounded-full text-neutral-950 dark:text-gray-300"
            >
              <FaCartArrowDown className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </NavbarButton>
           <NavbarButton
            onClick={toggleTheme}
            className="p-2 rounded-full text-neutral-950 dark:text-gray-300 "
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
          </NavbarButton>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="ml-4 font-bold text-gray-800 dark:text-gray-300 hover:scale-105 transition-transform"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}

          {!user ? (
            <div className="flex flex-col gap-4 w-full">
              <Link to="/login">
                <NavbarButton className="flex w-full bg-cyan-400 dark:bg-cyan-600 justify-center items-center">
                  <ImEnter className="w-6 h-6 mr-2" />
                  Login
                </NavbarButton>
              </Link>
            </div>
          ) : (
            <div className="w-full flex flex-col justify-center items-center gap-4">
              <NavbarButton
                onClick={() => {
                  navigate("/Profile");
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full bg-cyan-400 dark:bg-cyan-600 justify-center items-center "
              >
                <RiAccountCircleFill className="w-6 h-6 mr-2" />
                Profile
              </NavbarButton>
              <NavbarButton
                onClick={logout}
                className="flex w-full bg-cyan-400 dark:bg-cyan-600 justify-center items-center"
              >
                <ImExit className="w-6 h-6 mr-2" />
                Logout
              </NavbarButton>
            </div>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
