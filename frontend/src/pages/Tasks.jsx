import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { workspaceApi, api } from "../api/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Plus, Search, RefreshCcw, UserCircle2 } from "lucide-react";
import TaskModal from "../components/TaskModal";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTask, setSelectedTask] = useState(null);
  const [openCreateTask, setOpenCreateTask] = useState(false);

  const [search, setSearch] = useState("");
  const [workspaceId, setWorkspaceId] = useState(
    localStorage.getItem("workspaceId")
  );
  const workspaceName =
    localStorage.getItem("workspaceName") || "Workspace";

  // 🔥 Listen to workspace switch
  useEffect(() => {
    const handler = () => {
      setWorkspaceId(localStorage.getItem("workspaceId"));
    };
    window.addEventListener("workspaceChanged", handler);
    return () => window.removeEventListener("workspaceChanged", handler);
  }, []);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      if (!workspaceId) return;
      setLoading(true);
      const res = await workspaceApi.getTasks();
      setTasks(res.data || []);

      const empRes = await api.get(`/api/workspaces/${workspaceId}/employees`);
      setEmployees(empRes.data || []);

    } catch (err) {
      console.log("❌ Failed to fetch data:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [workspaceId]);

  // ✅ Normalize status values
  const normalizeStatus = (s) => {
    if (!s) return "Pending";
    const val = s.trim().toLowerCase();
    if (val.includes("progress")) return "InProgress";
    if (val.includes("done") || val.includes("complete")) return "Done";
    return "Pending";
  };

  // FILTER
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) =>
      t.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const grouped = useMemo(
    () => ({
      Pending: filteredTasks.filter(
        (t) => normalizeStatus(t.status) === "Pending"
      ),
      InProgress: filteredTasks.filter(
        (t) => normalizeStatus(t.status) === "InProgress"
      ),
      Done: filteredTasks.filter(
        (t) => normalizeStatus(t.status) === "Done"
      ),
    }),
    [filteredTasks]
  );

  // DRAG
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = normalizeStatus(destination.droppableId);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await fetch(
        `/api/workspaces/${workspaceId}/tasks/${draggableId}/status?status=${newStatus}`,
        { method: "PUT" }
      );
    } catch {
      fetchTasks();
    }
  };

  const priorityStyle = (p) => {
    if (p === "High") return "bg-red-100 text-red-700";
    if (p === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-brand-100/50 text-brand-700";
  };

  // COLUMN
  const Column = ({ colId, title, items, colorClass }) => (
    <Droppable droppableId={colId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 p-5 min-h-[450px] flex flex-col`}
        >
          <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
            <h3 className={`font-bold text-lg flex items-center gap-2 ${colorClass}`}>
              <div className={`w-2 h-2 rounded-full bg-current`}></div>
              {title}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold shadow-sm">
              {items.length}
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {items.map((task, index) => {
              const assignedEmployee = employees.find(e => e.id === task.employeeId);

              return (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`rounded-2xl p-4 border transition-all duration-200 group ${snapshot.isDragging
                          ? "bg-white shadow-xl rotate-2 scale-105 border-brand-300 z-50 ring-2 ring-brand-500/20"
                          : "bg-white hover:shadow-md hover:-translate-y-1 hover:border-gray-300 border-gray-100 cursor-pointer"
                        }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex gap-3">
                        <div {...prov.dragHandleProps} className="text-gray-300 mt-1 cursor-grab active:cursor-grabbing hover:text-gray-500 transition-colors">
                          <GripVertical size={16} />
                        </div>
                        <div className="flex-1 w-full overflow-hidden">
                          <p className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {task.description}
                          </p>

                          {assignedEmployee && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 w-fit max-w-full">
                              <UserCircle2 size={14} className="text-gray-400 shrink-0" />
                              <span className="font-medium truncate">{assignedEmployee.name}</span>
                            </div>
                          )}

                          <div className="mt-3 flex justify-between items-center bg-gray-50/50 p-2 rounded-xl border border-gray-50">
                            <span
                              className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold ${priorityStyle(
                                task.priority
                              )}`}
                            >
                              {task.priority || "Low"} Priority
                            </span>
                            {task.dueDate && (
                              <span className="text-[10px] font-medium text-gray-400">
                                Due: <span className="text-gray-500">{task.dueDate}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
            {items.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl p-8 bg-gray-50/50">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-3">
                  <div className="w-6 h-6 border-2 border-dashed border-gray-300 rounded-lg"></div>
                </div>
                Drop tasks here to update status
              </div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );

  // UI
  return (
    <Layout>
      {/* 🔥 Gradient Header */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Task Board</h2>
            <p className="text-brand-100 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse"></span>
              Workspace: {workspaceName}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenCreateTask(true)}
              className="bg-white/10 hover:bg-white text-white hover:text-brand-600 border border-white/20 whitespace-nowrap px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
            >
              <Plus size={18} />
              New Task
            </button>
            <button
              onClick={fetchTasks}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-2.5 rounded-xl transition-all"
              title="Refresh"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 Search */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-md mb-8 shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-300 transition-all">
        <Search size={18} className="text-gray-400" />
        <input
          className="outline-none w-full text-sm font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
          placeholder="Search task by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500">
          <RefreshCcw size={32} className="animate-spin mb-4 text-brand-500" />
          <p className="font-medium text-lg">Loading your task board...</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid lg:grid-cols-3 gap-6">
            <Column colId="Pending" title="To Do" items={grouped.Pending} colorClass="text-gray-600" />
            <Column colId="InProgress" title="In Progress" items={grouped.InProgress} colorClass="text-brand-600" />
            <Column colId="Done" title="Completed" items={grouped.Done} colorClass="text-teal-600" />
          </div>
        </DragDropContext>
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          workspaceId={workspaceId}
          onClose={() => setSelectedTask(null)}
          onUpdated={fetchTasks}
        />
      )}

      {openCreateTask && (
        <TaskModal
          workspaceId={workspaceId}
          isCreateMode
          task={{}}
          onClose={() => setOpenCreateTask(false)}
          onUpdated={fetchTasks}
        />
      )}
    </Layout>
  );
}
