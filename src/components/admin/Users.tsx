"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dialog from "@/components/Dialog";
import FullScreenLoader from "@/components/FullScreenLoader";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { createUsersApi, getUsersApi } from "@/api/admin";
import UserTableRow from "@/components/UserTableRow";
import Profile from "@/components/Profile";
import Toast from "@/components/Toast";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";

interface UsersProps {
  listUser: User[];
  user: User;
}

export default function Users({ listUser, user }: UsersProps) {
  const router = useRouter();
  const isBottom = useScrollToBottom();
  const limit = 10;
  const [offset, setOffset] = useState<number>(limit);
  const [search, setSearch] = useState<string>("");
  const lastId = listUser.at(-1)?.id || 0;
  const [users, setUsers] = useState<User[]>(listUser);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      const res = await createUsersApi(formData);
      const data = res.data;

      setUsers((prev) => [data, ...prev]);
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setLoading(false);
      setOpen(false);
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong, try again later.";

      setLoading(false);
      setOpen(false);
      setError(message);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await getUsersApi({ limit, offset: 0, search });
      setOffset(limit);
      setUsers(res.data);
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong, try again later.";

      setError(message);
    }
  };

  useEffect(() => {
    async function fn() {
      if (!isBottom) return;
      try {
        const res = await getUsersApi({ limit, offset, search, lastId });
        setOffset(offset + limit);
        setUsers((prev) => [...prev, ...res.data]);
      } catch (error: any) {
        console.log(error);
        const message =
          error?.response?.data?.message ||
          "Something went wrong, try again later.";

        setError(message);
      }
    }

    fn();
  }, [isBottom]);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
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
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
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
      <div className="px-6 pb-6 space-y-4">
        <div className="flex justify-between items-center mt-4 pb-4 border-b-2 border-indigo-100">
          <Profile user={user} />
          <div className="flex gap-4">
            <div
              onClick={() => {
                setLoading(true);
                router.push("/admin");
              }}
              className="flex items-center rounded-full px-2 py-1 border-1 cursor-pointer bg-indigo-200 border-indigo-300"
            >
              <p className="font-semibold text-indigo-500">Requests</p>
            </div>
            <div className="flex items-center rounded-full px-2 py-1 border-2 cursor-pointer bg-indigo-300 border-indigo-400">
              <p className="font-semibold text-indigo-600">Users</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-lg px-4 py-2 text-base w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600"
            >
              Search
            </button>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600"
          >
            Add
          </button>
        </div>

        <table className="min-w-full overflow-hidden rounded-xl shadow-md">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Request this year</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-800">
            {users.map((u, i) => (
              <UserTableRow key={u.id} index={i} user={u} setUsers={setUsers} />
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}
