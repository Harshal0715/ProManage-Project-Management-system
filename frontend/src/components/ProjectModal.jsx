import { useEffect, useState } from "react";
import { workspaceApi } from "../api/api";
import { useWorkspace } from "../context/WorkspaceContext";
import { X, Plus, Mail, FolderKanban, Calendar, Target, Flag, AlertCircle, Percent, Users, UserCircle2 } from "lucide-react";

export default function ProjectModal({ open, onClose, onCreated }) {
  const { workspaceId, workspaceName } = useWorkspace();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    startDate: "",
    endDate: "",
    projectLeadId: "",
    teamIds: [],
    progressPercent: 0,
    inviteEmail: "",
  });

  // ===============================
  // FETCH EMPLOYEES
  // ===============================
  useEffect(() => {
    if (!workspaceId || !open) return;

    const fetchEmployees = async () => {
      try {
        const res = await workspaceApi.getEmployees();
        setEmployees(res.data || []);
      } catch (err) {
        console.log("Failed to load employees");
      }
    };

    fetchEmployees();
  }, [workspaceId, open]);

  // ===============================
  // HANDLE SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await workspaceApi.createProject({
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        startDate: form.startDate,
        endDate: form.endDate,
        assignedEmployeeIds: form.teamIds,
        projectLeadId: form.projectLeadId,
        progressPercent: form.progressPercent || 0,
      });

      // 🔥 Optional invite simulation
      if (form.inviteEmail) {
        alert(`Invitation sent to ${form.inviteEmail}`);
      }

      onCreated();
      onClose();
    } catch (err) {
      console.log(err);
      alert("Project creation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">

        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-500 via-indigo-500 to-teal-500"></div>

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-gray-100">
              <FolderKanban size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Create New Project
              </h2>
              <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-0.5">
                Workspace <span className="text-brand-600">{workspaceName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-white border border-gray-200 text-gray-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 rounded-xl transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY CONTROLS OVERFLOW */}
        <div className="p-8 overflow-y-auto flex-1 scroll-smooth stylish-scrollbar">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Project Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Target size={16} /> Project Details
              </h3>

              <div className="grid gap-5">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FolderKanban size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all font-medium placeholder:font-normal placeholder:text-gray-400"
                    placeholder="E.g. Website Redesign v2"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <textarea
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 resize-none min-h-[100px]"
                  placeholder="Describe the scope, goals, and core requirements of this project..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Properties Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <AlertCircle size={16} /> Properties & Timeline
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 block pl-1">Status</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 font-medium cursor-pointer shadow-sm"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option>Planning</option>
                      <option>Active</option>
                      <option>OnHold</option>
                      <option>Completed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 block pl-1">Priority</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 font-medium cursor-pointer shadow-sm"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 block pl-1">Start Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400 group-focus-within:text-brand-500" />
                    </div>
                    <input
                      type="date"
                      className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 font-medium shadow-sm"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 block pl-1">Target End Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Flag size={16} className="text-gray-400 group-focus-within:text-brand-500" />
                    </div>
                    <input
                      type="date"
                      className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 font-medium shadow-sm"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Team Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Users size={16} /> Team & Assignments
              </h3>

              {/* PROJECT LEAD */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 block pl-1">Project Lead</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserCircle2 size={18} className="text-gray-400 group-focus-within:text-brand-500" />
                  </div>
                  <select
                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-10 pr-10 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 font-medium cursor-pointer shadow-sm"
                    value={form.projectLeadId}
                    onChange={(e) => setForm({ ...form, projectLeadId: e.target.value })}
                  >
                    <option value="" disabled className="text-gray-400">Assign a leader...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} — {emp.role}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>

              {/* TEAM MEMBERS */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 block pl-1">Assigned Members</label>
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-3 max-h-40 overflow-y-auto space-y-1.5 stylish-scrollbar">
                  {employees.map((emp) => (
                    <label key={emp.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-gray-100">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 shadow-sm cursor-pointer"
                          checked={form.teamIds.includes(emp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({ ...form, teamIds: [...form.teamIds, emp.id] });
                            } else {
                              setForm({ ...form, teamIds: form.teamIds.filter((id) => id !== emp.id) });
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{emp.name}</span>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{emp.role}</span>
                      </div>
                    </label>
                  ))}
                  {employees.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No employees available in this workspace.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* INITIAL PROGRESS */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 block pl-1">Starting Progress</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Percent size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 font-medium shadow-sm"
                      placeholder="e.g. 0"
                      value={form.progressPercent}
                      onChange={(e) => setForm({ ...form, progressPercent: e.target.value })}
                    />
                  </div>
                </div>

                {/* INVITE EXTERNAL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 block pl-1">External Invitations</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400 group-focus-within:text-brand-500" />
                      </div>
                      <input
                        type="email"
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 font-medium shadow-sm"
                        placeholder="client@email.com"
                        value={form.inviteEmail}
                        onChange={(e) => setForm({ ...form, inviteEmail: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3 rounded-b-[2rem]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="project-form"
            disabled={loading}
            className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Plus size={18} />
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>

      </div>
    </div>
  );
}
