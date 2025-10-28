export default function Footer() {
  return (
    <footer className="w-full py-8 bg-[#0d0d0d] text-gray-400 mt-20">
      <div className="max-w-[1440px] mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white">TicketApp</h2>
          <p className="mt-2 text-sm">
            Empowering event organizers with seamless tools for ticketing,
            promotion, and audience engagement.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#features" className="hover:text-blue-500">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-blue-500">
                Pricing
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-blue-500">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-500">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-sm mb-2">
            Subscribe to our newsletter for the latest updates and event
            insights.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-full focus:outline-none text-black"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-r-full hover:opacity-80 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} TicketApp. All rights reserved.
      </div>
    </footer>
  );
}
