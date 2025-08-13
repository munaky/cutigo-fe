"use client";

import { User } from "@/types/user";
import { SquarePen, Trash2 } from "lucide-react";
import Dialog from "./Dialog";
import React, { useState } from "react";
import { deleteUsersApi, updateUsersApi } from "@/api/admin";

interface UserTableRowProps {
  index: number;
  user: User;
  setUsers: (users: any) => void;
}

export default function UserTableRow({
  index,
  user,
  setUsers,
}: UserTableRowProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    updateUsersApi(user.id, formData).catch((e) => console.log(e));
    setUsers((prev: User[]) =>
      prev.map((item) =>
        item.id == user.id
          ? { ...item, name: formData.name, email: formData.email }
          : item
      )
    );
    setOpenUpdateDialog(false);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    deleteUsersApi(user.id);
    setUsers((prev: User[]) => prev.filter((item) => item.id != user.id));
    setOpenDeleteDialog(false);
  };
  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 font-medium">{user.name}</td>
        <td className="px-4 py-3">{user.email}</td>
        <td className="px-4 py-3 text-center">
          <div className="flex justify-center gap-2">
            {/* Update Dialog */}
            <Dialog
              open={openUpdateDialog}
              onClose={() => setOpenUpdateDialog(false)}
            >
              <form onSubmit={handleSubmitUpdate} className="space-y-4">
                <div>
                  <label className="block text-start text-sm font-medium text-gray-700">
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
                  <label className="block text-start text-sm font-medium text-gray-700">
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
                  <label className="block text-start text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={openDeleteDialog}
              onClose={() => setOpenDeleteDialog(false)}
            >
              <form
                onSubmit={(e) => handleDelete(e)}
                className="flex flex-col gap-6 min-w-[300px]"
              >
                <h2 className="text-lg text-start font-semibold text-gray-900">
                  Delete this user?
                </h2>
                <p className="text-sm text-start text-gray-600">
                  This action cannot be undone. The user data will be
                  permanently removed from the database.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenDeleteDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </Dialog>
            <button
            onClick={() => setOpenUpdateDialog(true)}
            className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors">
              <SquarePen size={16} />
            </button>
            <button
              onClick={() => setOpenDeleteDialog(true)}
              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
