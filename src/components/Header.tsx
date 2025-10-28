import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full py-4 shadow-md bg-[#0d0d0d] fixed top-0 left-0 z-50 border-b border-gray-800">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 text-white">
        <h1 className="text-2xl font-bold text-blue-400">TicketApp</h1>
        <nav className="space-x-6 hidden md:flex text-gray-300">
          <a href="#features" className="hover:text-blue-400 transition">
            Features
          </a>
          <a href="#pricing" className="hover:text-blue-400 transition">
            Pricing
          </a>
          <a href="#contact" className="hover:text-blue-400 transition">
            Contact
          </a>
        </nav>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition text-blue-400"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
