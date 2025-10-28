import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Only redirect if a valid session already exists
  useEffect(() => {
    try {
      const sessionRaw = sessionStorage.getItem("ticketapp_session");
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          window.location.href = "/dashboard";
          return;
        } else {
          sessionStorage.removeItem("ticketapp_session"); // expired session cleared
        }
      }
    } catch {
      sessionStorage.removeItem("ticketapp_session");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Function to find saved user
    const findSavedUser = () => {
      try {
        const singleRaw = sessionStorage.getItem("ticketapp_session");
        if (singleRaw) {
          const user = JSON.parse(singleRaw);
          if (user && user.email) return user;
        }
      } catch {}

      return null;
    };

    setTimeout(() => {
      const savedUser = findSavedUser();
      console.log(savedUser);

      const isValid =
        savedUser &&
        savedUser.email === email &&
        savedUser.password === password;

      if (isValid) {
        // ✅ Create session only on successful login
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
        const token = btoa(`${email}-${Date.now()}`);

        sessionStorage.setItem(
          "ticketapp_session",
          JSON.stringify({ token, email, expiresAt })
        );

        setSuccess("Login successful! Redirecting...");
        setTimeout(() => (window.location.href = "/dashboard"), 500);
      } else {
        setError("Invalid email or password.");
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Welcome Back
        </h2>

        {error && (
          <p className="bg-red-500/20 text-red-400 p-2 rounded mb-4">{error}</p>
        )}
        {success && (
          <p className="bg-green-500/20 text-green-400 p-2 rounded mb-4">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 text-sm text-blue-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <a
              href="/signup"
              className="text-blue-400 text-sm mt-2 inline-block"
            >
              Create an account
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
