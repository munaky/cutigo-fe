import { User } from "@/types/user";
import { logout } from "@/utils/auth";
import { LogOut, UserCog, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FullScreenLoader from "./FullScreenLoader";
import Dialog from "./Dialog";
import { updateUserPassword } from "@/api/auth";
import Toast from "./Toast";

export default function Profile({ user }: { user: User | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogout = () => {
    setLoading(true);
    logout();
    router.replace("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      await updateUserPassword(password);
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong, try again later.";

      setError(message)
    }

    setLoading(false)
    setOpen(false);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4 relative">
      <FullScreenLoader loading={loading} />
      {error && (
        <Toast
          type={"error"}
          title={"Error!"}
          message={error}
          onClose={() => setError("")}
        />
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
      
                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
              </form>
            </Dialog>

      {/* Settings Icon + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <UserCog size={22} className="text-gray-600" />
        </button>

        {dropdownOpen && (
          <div
            className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fadeIn"
          >
            <button
              onClick={() => {
                setOpen(true);
                setDropdownOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              <KeyRound size={18} />
              Edit Password
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Username */}
      <div className="px-3 py-1 rounded-full bg-indigo-100">
        <h1 className="text-xl font-bold text-gray-600">
          {user?.name || "Loading..."}
        </h1>
      </div>
    </div>
  );
}
