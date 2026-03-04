import { useEffect, useMemo, useState } from "react";
import { X, Trash2, Save, Plus } from "lucide-react";
import { api } from "../api/api";

export default function TaskModal({
  task,
  onClose,
  onUpdated,
  isCreateMode = false,
}) {
  const workspaceId = localStorage.getItem("workspaceId");

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [saving, setSaving] = useState(false);

  // =========================
  // FORM STATE
  // =========================
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "Low",
    status: task?.status || "Pending",
    dueDate: task?.dueDate || "",
    employeeId: task?.employeeId || "",
    projectId: task?.projectId || "",
  });

  // =========================
  // LOAD EMPLOYEES + PROJECTS (FIXED)
  // =========================
  useEffect(() => {
    if (!workspaceId) return;

    api.get(`/api/workspaces/${workspaceId}/employees`)
      .then(res => setEmployees(res.data || []))
      .catch(() => setEmployees([]));

    api.get(`/api/workspaces/${workspaceId}/projects`)
      .then(res => setProjects(res.data || []))
      .catch(() => setProjects([]));

  }, [workspaceId]);

  // =========================
  // RESET FORM WHEN TASK CHANGES
  // =========================
  useEffect(() => {
    setForm({
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "Low",
      status: task?.status || "Pending",
      dueDate: task?.dueDate || "",
      employeeId: task?.employeeId || "",
      projectId: task?.projectId || "",
    });
  }, [task]);

  const canSave = useMemo(() => {
    return form.title.trim() && form.description.trim();
  }, [form]);

  // =========================
  // CREATE TASK (FIXED)
  // =========================
  const createTask = async () => {
    if (!workspaceId) {
      alert("No workspace selected");
      return;
    }

    if (!canSave) {
      alert("Fill title & description");
      return;
    }

    if (!form.projectId) {
      alert("Select a project");
      return;
    }

    try {
      setSaving(true);

      await api.post(
        `/api/workspaces/${workspaceId}/tasks`,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          priority: form.priority,
          status: form.status,
          dueDate: form.dueDate || null,
          employeeId: form.employeeId || null,
          projectId: form.projectId,
        }
      );

      onUpdated?.();
      onClose?.();

    } catch (err) {
      console.log(err);
      alert("Create failed");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UPDATE TASK (FIXED)
  // =========================
  const updateTask = async () => {
    if (!workspaceId) return;

    if (!canSave) {
      alert("Fill title & description");
      return;
    }

    try {
      setSaving(true);

      await api.put(
        `/api/workspaces/${workspaceId}/tasks/${task.id}`,
        {
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
          projectId: form.projectId || task.projectId,
        }
      );

      onUpdated?.();
      onClose?.();

    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE TASK (FIXED)
  // =========================
  const deleteTask = async () => {
    if (!workspaceId) return;
    if (!confirm("Delete this task?")) return;

    try {
      await api.delete(
        `/api/workspaces/${workspaceId}/tasks/${task.id}`
      );

      onUpdated?.();
      onClose?.();

    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border">

        {/* Header */}
        <div className="flex justify-between p-5 border-b">
          <h3 className="font-bold text-lg">
            {isCreateMode ? "Create Task" : "Task Details"}
          </h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="w-full border rounded-xl p-3"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          {/* STATUS */}
          <select
            className="w-full border rounded-xl p-3"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option>Pending</option>
            <option>InProgress</option>
            <option>Done</option>
          </select>

          {/* EMPLOYEE */}
          <select
            className="w-full border rounded-xl p-3"
            value={form.employeeId}
            onChange={e => setForm({ ...form, employeeId: e.target.value })}
          >
            <option value="">Unassigned</option>
            {employees.map(e =>
              <option key={e.id} value={e.id}>{e.name}</option>
            )}
          </select>

          {/* PROJECT */}
          <select
            className="w-full border rounded-xl p-3"
            value={form.projectId}
            onChange={e => setForm({ ...form, projectId: e.target.value })}
            disabled={!isCreateMode && !!task?.projectId}
          >
            <option value="">Select Project</option>
            {projects.map(p =>
              <option key={p.id} value={p.id}>{p.title}</option>
            )}
          </select>

          {/* DUE DATE */}
<div>
  <label className="block text-sm font-semibold text-gray-600 mb-2">
    Due Date
  </label>
  <input
    type="date"
    className="w-full border rounded-xl p-3"
    value={form.dueDate || ""}
    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
  />
</div>

          {/* Buttons */}
          <div className="flex justify-between">

            {!isCreateMode &&
              <button
                onClick={deleteTask}
                className="bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                <Trash2 size={18}/> Delete
              </button>
            }

            <button
              onClick={isCreateMode ? createTask : updateTask}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center"
            >
              {isCreateMode ? <Plus size={18}/> : <Save size={18}/>}
              {saving ? "Saving..." : "Save"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}