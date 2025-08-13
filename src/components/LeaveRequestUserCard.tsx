import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { LeaveRequest } from "@/types/leaveRequest";
import { deleteLeaveRequestApi } from "@/api/user";
import { formatDate } from "@/utils/formatDate";
import Dialog from "./Dialog";

interface LeaveRequestProps {
  record: LeaveRequest;
  setRecords: (data: any) => void;
}

export default function LeaveRequestUserCard({
  record,
  setRecords,
}: LeaveRequestProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    deleteLeaveRequestApi(record.id).catch((err: any) => console.log(err));
    setRecords((prev: LeaveRequest[]) =>
      prev.filter((r) => r.id !== record.id)
    );
  }

  return (
    <div
      className={
        "max-w-xs w-xs rounded-lg border-2 bg-white p-4 shadow-lg " +
        (record.status == "PENDING"
          ? "border-blue-300"
          : record.status == "APPROVED"
          ? "border-green-300"
          : "border-red-300")
      }
    >
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <form
          onSubmit={(e) => handleDelete(e)}
          className="flex flex-col gap-6 min-w-[300px]"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Delete this request?
          </h2>
          <p className="text-sm text-gray-600">
            This action cannot be undone. The request data will be permanently
            removed from the database.
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

      {/* Status */}
      <p
        className={
          "text-center text-lg font-bold " +
          (record.status == "PENDING"
            ? "text-blue-500"
            : record.status == "APPROVED"
            ? "text-green-500"
            : "text-red-500")
        }
      >
        {record.status}
      </p>

      {/* Date range */}
      <p className="mt-1 text-center font-semibold text-gray-800">
        {formatDate(record.startDate)} ~ {formatDate(record.endDate)}
      </p>

      {/* Reason */}
      <div className="border-t-1 border-gray-200 mt-2 mb-2"></div>
      <p className="h-[6ch] max-h-[6ch] overflow-y-auto break-all text-center italic text-gray-500 leading-snug">
        &quot;{record.reason}&quot;
      </p>

      {/* Bottom section */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {formatDate(record.createdAt)}
        </span>
        <div className="p-1 rounded-lg cursor-pointer bg-red-500 hover:bg-red-600">
          <Trash2
            onClick={() => setOpenDeleteDialog(true)}
            size={16}
            className="text-white"
          />
        </div>
      </div>
    </div>
  );
}
