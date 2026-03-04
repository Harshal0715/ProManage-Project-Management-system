import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { workspaceApi } from "../api/api";
import { useWorkspace } from "../context/WorkspaceContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  CalendarDays,
  GripVertical,
  ArrowLeft,
  Plus,
  FolderKanban,
  RefreshCcw,
  Clock,
  Loader,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from "lucide-react";

import TaskModal from "../components/TaskModal";

export default function ProjectBoard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workspaceName } = useWorkspace();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const projectRes = await workspaceApi.getProjectById(id);
      setProject(projectRes.data);
      const tasksRes = await workspaceApi.getTasksByProject(id);
      setTasks(tasksRes.data || []);
    } catch (err) {
      console.log("Board load error:", err);
      setErrorMsg("Failed to load project board.");
      setProject(null);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [id]);

  const grouped = {
    Pending: tasks.filter((t) => t.status === "Pending"),
    InProgress: tasks.filter((t) => t.status === "InProgress"),
    Done: tasks.filter((t) => t.status === "Done"),
  };

  const completionRate =
    tasks.length > 0
      ? Math.round((grouped.Done.length / tasks.length) * 100)
      : 0;

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await workspaceApi.updateTaskStatus(draggableId, newStatus);
    } catch {
      // Revert on failure
      fetchBoardData();
    }
  };

  const priorityStyle = (p) => {
    if (p === "High") return "bg-rose-50 text-rose-700 border-rose-200";
    if (p === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const Column = ({ colId, title, icon, items }) => {
    // Determine column styling based on status
    let bgStyle = "bg-gray-50/50 border-gray-100";
    let headerStyle = "text-gray-700";
    let badgeStyle = "bg-gray-200 text-gray-700";

    if (colId === "InProgress") {
      bgStyle = "bg-brand-50/30 border-brand-100/50";
      headerStyle = "text-brand-800";
      badgeStyle = "bg-brand-100 text-brand-700";
    } else if (colId === "Done") {
      bgStyle = "bg-emerald-50/30 border-emerald-100/50";
      headerStyle = "text-emerald-800";
      badgeStyle = "bg-emerald-100 text-emerald-700";
    }

    return (
      <Droppable droppableId={colId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`rounded-[2rem] p-5 min-h-[500px] border transition-colors duration-200 ${bgStyle} ${snapshot.isDraggingOver ? "ring-2 ring-brand-400 ring-inset bg-brand-50/50" : ""
              }`}
          >
            <div className={`flex justify-between mb-6 items-center px-2 ${headerStyle}`}>
              <h3 className="font-bold text-lg flex items-center gap-2.5">
                {icon}
                {title}
              </h3>
              <span className={`text-xs px-3 py-1 rounded-full font-bold shadow-sm ${badgeStyle}`}>
                {items.length}
              </span>
            </div>

            <div className="space-y-4 min-h-[100px]">
              {items.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className={`group rounded-2xl p-5 border cursor-grab active:cursor-grabbing transition-all duration-200 ${snapshot.isDragging
                          ? "bg-white shadow-2xl scale-105 rotate-2 border-brand-300 ring-1 ring-brand-300 z-50"
                          : "bg-white shadow-sm hover:shadow-md border-gray-200 hover:border-brand-300 relative"
                        }`}
                      onClick={(e) => {
                        // Prevent opening modal if dragging
                        if (!snapshot.isDragging && !e.defaultPrevented) setSelectedTask(task);
                      }}
                      style={{
                        ...prov.draggableProps.style,
                        // Ensure smooth snapping
                        transition: snapshot.isDragging ? "none" : "all 0.2s cubic-bezier(0.2, 0, 0, 1)"
                      }}
                    >
                      {/* Drag Handle Indicator */}
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5 text-gray-300">
                        <GripVertical size={16} />
                      </div>

                      <div className="pl-2">
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider border ${priorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority || "Low"}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-gray-100">
                            <MoreVertical size={14} />
                          </button>
                        </div>

                        <h4 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors leading-tight mb-2">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                            {task.description}
                          </p>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                          {task.assignedEmployeeName ? (
                            <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignedEmployeeName}`}>
                              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold border border-indigo-200">
                                {task.assignedEmployeeName.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-xs font-medium text-gray-600 max-w-[80px] truncate">
                                {task.assignedEmployeeName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Unassigned</span>
                          )}

                          <span className={`text-[11px] font-medium flex items-center gap-1 px-2 py-1 rounded-md ${!task.dueDate ? 'text-gray-400' :
                              new Date(task.dueDate) < new Date() && t.status !== 'Done' ? 'text-rose-600 bg-rose-50' :
                                'text-gray-500 bg-gray-50'
                            }`}>
                            <CalendarDays size={12} />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "No date"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {items.length === 0 && (
                <div className="text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    <Plus size={16} className="text-gray-400" />
                  </div>
                  <span className="font-medium">Drag tasks here</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-brand-500 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="font-bold text-gray-600">Loading your board...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-[2rem] shadow-sm text-center max-w-lg mx-auto mt-12">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-rose-600 font-medium mb-6">{errorMsg}</p>
          <button
            onClick={fetchBoardData}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:bg-black transition-colors font-bold shadow-md"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* PREMIUM HEADER - Matched with other pages */}
          <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-900 border border-brand-800/50 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg mb-4 backdrop-blur-md border border-white/10 shadow-inner text-sm font-medium text-brand-100">
                  <FolderKanban size={16} /> Kanban Board
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
                  {project?.title || "Project Board"}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-brand-100 text-sm mt-3">
                  <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md backdrop-blur-sm">
                    <strong>Workspace:</strong> {workspaceName}
                  </span>
                  {project?.startDate && project?.endDate && (
                    <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md backdrop-blur-sm">
                      <CalendarDays size={14} />
                      {new Date(project.startDate).toLocaleDateString()} → {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {project?.description && (
                  <p className="text-brand-50/80 mt-4 max-w-2xl text-sm leading-relaxed border-l-2 border-brand-500/50 pl-3">
                    {project.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-4 min-w-[200px]">
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => navigate("/admin/projects")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold transition-all backdrop-blur-sm"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={() => setOpenCreateTask(true)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-brand-900 border border-white hover:bg-brand-50 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg"
                  >
                    <Plus size={18} strokeWidth={2.5} /> Add Task
                  </button>
                </div>

                <div className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 mt-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-200">Progress</span>
                    <span className="text-xl font-black">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden shadow-inner">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${completionRate}%` }}
                    >
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto pb-4 custom-scrollbar">
              <Column
                colId="Pending"
                title="To Do"
                icon={<div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center"><Clock size={16} className="text-gray-600" /></div>}
                items={grouped.Pending}
              />
              <Column
                colId="InProgress"
                title="In Progress"
                icon={<div className="w-8 h-8 rounded-lg bg-brand-200 flex items-center justify-center"><Loader size={16} className="text-brand-700 animate-spin-slow" /></div>}
                items={grouped.InProgress}
              />
              <Column
                colId="Done"
                title="Completed"
                icon={<div className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center"><CheckCircle size={16} className="text-emerald-700" /></div>}
                items={grouped.Done}
              />
            </div>
          </DragDropContext>
        </>
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          workspaceId={workspaceApi.getWorkspaceId()}
          onClose={() => setSelectedTask(null)}
          onUpdated={fetchBoardData}
        />
      )}

      {openCreateTask && (
        <TaskModal
          task={{
            title: "",
            description: "",
            projectId: id,
            status: "Pending",
            priority: "Low",
            dueDate: "",
          }}
          workspaceId={workspaceApi.getWorkspaceId()}
          isCreateMode
          onClose={() => setOpenCreateTask(false)}
          onUpdated={() => {
            setOpenCreateTask(false);
            fetchBoardData();
          }}
        />
      )}
    </Layout>
  );
}
