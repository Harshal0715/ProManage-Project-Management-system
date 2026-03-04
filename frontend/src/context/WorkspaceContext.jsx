import { createContext, useContext, useEffect, useState } from "react";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  // ✅ Always default to empty string if nothing in localStorage
  const [workspaceId, setWorkspaceId] = useState(
    () => localStorage.getItem("workspaceId") || ""
  );

  const [workspaceName, setWorkspaceName] = useState(
    () => localStorage.getItem("workspaceName") || ""
  );

  const [role, setRole] = useState(
    () => localStorage.getItem("role") || ""
  );

  const [name, setName] = useState(
    () => localStorage.getItem("name") || ""
  );

  // 🔥 MAIN WORKSPACE SWITCH FUNCTION
  const changeWorkspace = (id, newName) => {
    localStorage.setItem("workspaceId", id || "");
    localStorage.setItem("workspaceName", newName || "");

    setWorkspaceId(id || "");
    setWorkspaceName(newName || "");

    // 🔥 Force entire app to re-render properly
    window.dispatchEvent(new Event("workspaceChanged"));
  };

  // 🔥 Sync if changed from somewhere else
  useEffect(() => {
    const syncWorkspace = () => {
      setWorkspaceId(localStorage.getItem("workspaceId") || "");
      setWorkspaceName(localStorage.getItem("workspaceName") || "");
      setRole(localStorage.getItem("role") || "");
      setName(localStorage.getItem("name") || "");
    };

    window.addEventListener("workspaceChanged", syncWorkspace);

    return () => {
      window.removeEventListener("workspaceChanged", syncWorkspace);
    };
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceId,
        workspaceName,
        role,
        name,
        changeWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return context;
};
