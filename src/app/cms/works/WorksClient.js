"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Transition } from "@headlessui/react";
import { createWork, updateWork, deleteWork } from "@/app/cms/actions";
import RichTextEditor from "@/app/cms/RichTextEditor";

const TEXT_FIELDS = [
  { name: "title", label: "Title", required: true },
  { name: "company_name", label: "Company Name" },
  { name: "location", label: "Location" },
  { name: "time", label: "Time (e.g. 2020 — 2023)" },
];

export default function WorksClient({ initialData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  function openAdd() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    const result = editing
      ? await updateWork(editing.id, fd)
      : await createWork(fd);

    if (!result.ok) {
      setError(result.error || "Something went wrong.");
      return;
    }
    closeModal();
    startTransition(() => router.refresh());
  }

  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    const result = await deleteWork(id);
    if (!result.ok) {
      alert(result.error || "Failed to delete.");
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#31ecff] opacity-80">Works</h1>
        <button
          onClick={openAdd}
          className="text-sm bg-[#31ecff] bg-opacity-20 text-[#31ecff] px-4 py-2 rounded hover:bg-opacity-30 transition-all duration-150"
        >
          + Add New
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#ccdbe0] opacity-60 border-b border-[#31ecff] border-opacity-20">
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Company</th>
              <th className="py-3 pr-4">Location</th>
              <th className="py-3 pr-4">Time</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {initialData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#31ecff] border-opacity-10 text-[#ccdbe0] opacity-70 hover:opacity-100 transition-all duration-150"
              >
                <td className="py-3 pr-4">{item.title}</td>
                <td className="py-3 pr-4">{item.company_name}</td>
                <td className="py-3 pr-4">{item.location}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{item.time}</td>
                <td className="py-3 flex gap-3">
                  <button
                    onClick={() => openEdit(item)}
                    className="text-[#31ecff] text-xs underline underline-offset-2 opacity-60 hover:opacity-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 text-xs underline underline-offset-2 opacity-60 hover:opacity-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Transition
        show={modalOpen}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black bg-opacity-60"
          />
          <div className="relative z-10 bg-gray-900 border border-[#31ecff] border-opacity-20 rounded-lg w-full max-w-[768px] max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-[#31ecff] mb-6">
              {editing ? "Edit Work" : "Add Work"}
            </h2>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {TEXT_FIELDS.map(({ name, label, required }) => (
                <label key={name} className="flex flex-col gap-1">
                  <span className="text-xs text-[#ccdbe0] opacity-60">
                    {label}
                  </span>
                  <input
                    type="text"
                    name={name}
                    defaultValue={editing?.[name] ?? ""}
                    required={required}
                    className="bg-transparent border border-[#31ecff] border-opacity-20 text-[#ccdbe0] text-sm px-3 py-2 rounded focus:outline-none focus:border-opacity-60"
                  />
                </label>
              ))}

              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#ccdbe0] opacity-60">
                  Job Description
                </span>
                <RichTextEditor
                  name="job_desc"
                  defaultValue={editing?.job_desc ?? ""}
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-[#31ecff] bg-opacity-20 text-[#31ecff] font-semibold py-2 rounded hover:bg-opacity-30 transition-all duration-150 disabled:opacity-40"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-[#31ecff] border-opacity-20 text-[#ccdbe0] py-2 rounded hover:border-opacity-60 transition-all duration-150"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </>
  );
}
