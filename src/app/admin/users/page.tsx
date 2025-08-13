"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dialog from "@/components/Dialog";
import FullScreenLoader from "@/components/FullScreenLoader";
import { getUser, logout } from "@/utils/auth";
import { LogOut, SquarePen, Trash2 } from "lucide-react";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { createUsersApi, getUsersApi } from "@/api/admin";
import UserTableRow from "@/components/UserTableRow";

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    createUsersApi(formData)
    .then(r => {
        const data = r.data;

        setUsers(prev => [data, ...prev]);
        setFormData({
            name: "",
            email: "",
            password: ''
          });
    })
    .catch(e => console.log(e))
    .finally(() => {
        setOpen(false);
        setLoading(false);
    })
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    setUser(getUser());
    setLoading(true);
    getUsersApi()
      .then((r) => {
        const data: any = r.data;
        
        setUsers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <FullScreenLoader loading={loading} />
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
          <div className="flex flex-row items-center px-3 rounded-full bg-indigo-100">
            <h1 className="text-xl font-bold text-gray-500">{user?.name || 'Loading...'}</h1>
            <LogOut
              onClick={handleLogout}
              size={20}
              className="ml-4 cursor-pointer text-red-500"
            ></LogOut>
          </div>
          <div className="flex gap-4">
            <div
            onClick={() => router.push('/admin')}
            className="flex items-center rounded-full px-2 py-1 border-1 bg-indigo-200 border-indigo-300">
              <p className="font-semibold text-indigo-500">Requests</p>
            </div>
            <div className="flex items-center rounded-full px-2 py-1 border-2 bg-indigo-300 border-indigo-400">
              <p className="font-semibold text-indigo-600">Users</p>
            </div>
          </div>
        </div>

        <div className="flex">
            <button
            onClick={() => setOpen(true)}
            className="px-2 py-1 rounded font-semibold text-white bg-green-500 hover:bg-green-500">
                Add
            </button>
        </div>

        <table className="min-w-full overflow-hidden rounded-xl shadow-md">
  <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
    <tr>
      <th className="px-4 py-3 text-left">No</th>
      <th className="px-4 py-3 text-left">Name</th>
      <th className="px-4 py-3 text-left">Email</th>
      <th className="px-4 py-3 text-center">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 text-gray-800">
    {users.map((u, i) => <UserTableRow key={u.id} index={i} user={u} setUsers={setUsers} />)}
  </tbody>
</table>

      </div>
    </ProtectedRoute>
  );
}
