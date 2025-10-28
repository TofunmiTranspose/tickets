import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-gray-200">
      <Header />
      <main className="max-w-[1440px] w-full mx-auto relative overflow-visible flex-1">
        <section className="relative rounded-lg mt-6 px-6 py-20 md:py-28 bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a]">
          <div
            className="decor-circle hidden md:block absolute"
            style={{
              width: 220,
              height: 220,
              background: "linear-gradient(135deg,#3b82f6,#1e3a8a)",
              left: -40,
              top: -40,
              borderRadius: "50%",
              opacity: 0.3,
            }}
            aria-hidden="true"
          />
          <div
            className="decor-circle absolute"
            style={{
              width: 120,
              height: 120,
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              right: -20,
              top: 48,
              borderRadius: "50%",
              opacity: 0.4,
            }}
            aria-hidden="true"
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              TicketApp — Track issues. Ship fixes. Delight users.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              A powerful ticket management interface with a unified design
              across React, Vue and Twig.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 rounded-lg bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div
            className="w-full absolute left-0 right-0 -bottom-1 pointer-events-none"
            aria-hidden="true"
            role="img"
          >
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              className="block w-full h-20"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#0d0d0d" />
                </linearGradient>
              </defs>
              <path
                d="M0,40 C240,120 360,0 720,40 C1080,80 1200,20 1440,70 L1440 120 L0 120 Z"
                fill="url(#waveGradient)"
              />
            </svg>
          </div>
        </section>
        <section className="max-w-6xl mx-auto mt-12 px-6">
          <h2 className="text-3xl font-semibold text-center text-white mb-8">
            What you get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article
              className="p-6 rounded-lg bg-[#1a1a1a] shadow-lg border border-gray-800"
              aria-labelledby="f1"
            >
              <h3 id="f1" className="text-xl font-semibold text-blue-400 mb-2">
                Fast setup
              </h3>
              <p className="text-sm text-gray-300">
                Simulated auth and local storage persistence so you can test
                flows without a backend.
              </p>
            </article>
            <article
              className="p-6 rounded-lg bg-[#1a1a1a] shadow-lg border border-gray-800"
              aria-labelledby="f2"
            >
              <h3 id="f2" className="text-xl font-semibold text-blue-400 mb-2">
                Ticket CRUD
              </h3>
              <p className="text-sm text-gray-300">
                Create, edit, view and delete tickets with real-time validation
                and status tags.
              </p>
            </article>
            <article
              className="p-6 rounded-lg bg-[#1a1a1a] shadow-lg border border-gray-800"
              aria-labelledby="f3"
            >
              <h3 id="f3" className="text-xl font-semibold text-blue-400 mb-2">
                Accessible & Responsive
              </h3>
              <p className="text-sm text-gray-300">
                Semantic markup, visible focus states, and mobile-first
                responsive layout.
              </p>
            </article>
          </div>
        </section>
        <section className="max-w-4xl mx-auto mt-12 px-6 mb-20">
          <div className="p-6 rounded-lg bg-[#1a1a1a] shadow-lg border border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-300 flex-1">
              Use demo credentials:{" "}
              <strong className="text-white">test@example.com</strong> /{" "}
              <strong className="text-white">Password123</strong>
            </p>
            <Link
              to="/signup"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
            >
              Try demo
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
