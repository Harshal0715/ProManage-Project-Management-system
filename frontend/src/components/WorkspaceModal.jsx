import { useMemo, useState } from "react";
import { X, Upload } from "lucide-react";
import { api } from "../api/api";

export default function WorkspaceModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const slug = useMemo(() => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }, [name]);

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return alert("Enter organization name");

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.userId) {
        alert("User not found. Please login again.");
        return;
      }

      // ✅ FIXED ENDPOINT (matches backend controller)
      await api.post(
        `/api/workspaces/owner/${user.userId}`,
        {
          name,
          description: slug,
        }
      );

      setName("");
      setLogo(null);

      onCreated?.();
      onClose();

    } catch (err) {
      console.log(err);
      alert("❌ Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Create organization
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Logo Upload */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Logo</p>

          <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:bg-gray-50">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Upload size={18} className="text-gray-500" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">Upload</p>
              <p className="text-xs text-gray-500">
                Recommended size 1:1 up to 10MB
              </p>
            </div>

            <input
              type="file"
              className="hidden"
              onChange={(e) => setLogo(e.target.files?.[0])}
            />
          </label>

          {logo && (
            <p className="text-xs text-gray-500 mt-2">
              ✅ Selected: {logo.name}
            </p>
          )}
        </div>

        {/* Name */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Name</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Organization name"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Slug</p>
          <input
            value={slug || "my-org"}
            readOnly
            className="w-full border rounded-xl p-3 bg-gray-50 text-gray-600"
          />
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create organization"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Development mode ✅ (Your Final Year Project UI)
        </p>
      </div>
    </div>
  );
}