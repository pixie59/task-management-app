import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
function Boards() {
  const [isOpen, setIsOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [boardToDelete, setBoardToDelete] = useState(null)
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [stats, setStats] = useState({
    totalBoards: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  })
  const [boards, setBoards] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [icon, setIcon] = useState("📋");
  const [search, setSearch] = useState("");
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Editor")
  const [inviteBoardId, setInviteBoardId] = useState(null)
  const [inviteLoading, setInviteLoading] = useState(false)
  const filteredBoards = boards.filter(board =>
  board.title.toLowerCase().includes(search.toLowerCase())
);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true")
  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/board/get-boards", {
        headers: { authorization: token },
      })
      const data = await response.json()
      setBoards(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("fetchBoards error", err)
      setBoards([])
    }
  }
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/board/dashboard-stats", {
        headers: { authorization: token },
      })
      if (!res.ok) {
        setStats({ totalBoards: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0 })
        return
      }
      const data = await res.json()
      setStats({
        totalBoards: data.totalBoards ?? 0,
        totalTasks: data.totalTasks ?? 0,
        completedTasks: data.completedTasks ?? 0,
        pendingTasks: data.pendingTasks ?? 0,
      })
    } catch (err) {
      console.error("fetchStats error", err)
    }
  }
  const getUpcomingTasks = () => {
    const tasks = boards.flatMap((board) =>
      (board.task || []).map((task) => ({
        ...task,
        boardTitle: board.title,
      }))
    )

    return tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        ...task,
        dueDateObj: new Date(task.dueDate),
      }))
      .filter((task) => !isNaN(task.dueDateObj.getTime()))
      .sort((a, b) => a.dueDateObj - b.dueDateObj)
      .slice(0, 3)
  }

  const formatDueText = (dueDateObj) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffDays = Math.round((dueDateObj - today) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays > 1) return `In ${diffDays} days`
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"}`
  }

  useEffect(() => {
    fetchBoards()
    fetchStats()
  }, [])
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/"
    }
  }, [])
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])
const createBoard = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/board/create-board",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          title,
          description,
          icon,
        }),
      }
    );

    if (!res.ok) {
      toast.error("Failed to create board");
      console.error("createBoard failed", await res.text());
    } else {
      toast.success("Board created successfully 🎉");

      await fetchBoards();
      await fetchStats();

      setTitle("");
      setDescription("");
      setIcon("📋");
    }
  } catch (err) {
    toast.error("Something went wrong ❌");
    console.error("createBoard error", err);
  } finally {
    setLoading(false);
  }
}
  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }
  const deleteBoard = (id) => {
    setBoardToDelete(id)
    setShowDeleteModal(true)
  }
  const confirmDeleteBoard = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!boardToDelete) return
      await fetch(`http://localhost:5000/api/board/${boardToDelete}`, {
        method: "DELETE",
        headers: { authorization: token },
      })
      await fetchBoards()
      await fetchStats()
      toast.success("Board deleted successfully")
      setShowDeleteModal(false)
      setBoardToDelete(null)
      await fetchBoards()
      await fetchStats()
    } catch (err) {
      console.error("confirmDeleteBoard error", err)
    }
  }
  const openEditModal = (board) => {
    setSelectedBoard(board)
    setEditTitle(board.title ?? "")
    setEditDescription(board.description ?? "")
    setIsOpen(true)
  }
  const saveBoard = async () => {
    if (!selectedBoard) return
    try {
      setSaving(true)
      const token = localStorage.getItem("token")
      await fetch(`http://localhost:5000/api/board/${selectedBoard.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
      toast.success("Board updated successfully")
      setIsOpen(false)
      await fetchBoards()
      await fetchStats()
    } catch (err) {
      console.error("saveBoard error", err)
      toast.error("Failed to update board")
    } finally {
      setSaving(false)
    }
  }

  // const sendInvite = async () => {
  //   if (!inviteEmail || !inviteBoardId) return toast.error("Please provide email and select a board")
  //   try {
  //     setInviteLoading(true)
  //     const token = localStorage.getItem("token")
  //     const res = await fetch(`http://localhost:5000/api/board/${inviteBoardId}/invite`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: token,
  //       },
  //       body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
  //     })
  //     if (!res.ok) {
  //       const text = await res.text()
  //       toast.error("Failed to send invite")
  //       console.error("invite error", text)
  //     } else {
  //       toast.success("Invite sent")
  //       setInviteModalOpen(false)
  //     }
  //   } catch (err) {
  //     console.error("sendInvite error", err)
  //     toast.error("Something went wrong")
  //   } finally {
  //     setInviteLoading(false)
  //   }
  // }
  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-gradient-to-br from-gray-900 to-black text-white" : "bg-gradient-to-br from-gray-100 to-gray-200 text-black"
      }`}
    >
      <div className="flex justify-end gap-4 mb-4">
        <button onClick={() => setDarkMode(!darkMode)} className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition border border-gray-700">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <button onClick={() => (window.location.href = "/profile")} className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition border border-gray-700">
          Profile
        </button>
        <button onClick={logout} className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition border border-gray-700">
          Logout
        </button>
      </div>
      <div className={`max-w-4xl mx-auto mb-10 rounded-3xl shadow-lg ${darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
        <div className="px-6 py-5 border-b border-slate-200/70">
          <p className={`text-sm uppercase tracking-[0.2em] font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Upcoming Deadlines</p>
          <h2 className="mt-3 text-3xl font-semibold">⚠ Upcoming Tasks</h2>
        </div>
        <div className="space-y-3 p-6">
          {getUpcomingTasks().length > 0 ? (
            getUpcomingTasks().map((task) => (
              <div key={task.id} className={`rounded-3xl p-4 ${darkMode ? "bg-slate-900/80" : "bg-slate-50"}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white">📅 {task.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{task.boardTitle}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                    {formatDueText(task.dueDateObj)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={`rounded-3xl p-4 ${darkMode ? "bg-slate-900/80" : "bg-slate-50"}`}>
              <p className="text-sm text-slate-500">No upcoming tasks with due dates.</p>
            </div>
          )}
        </div>
      </div>
   <h1 className="text-5xl font-extrabold text-center mb-10 tracking-tight">Boards Dashboard</h1>
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8`}>
        <div className={`p-4 rounded-2xl shadow text-center ${darkMode ? "bg-slate-800 text-white" : "bg-white text-black"}`}>
          <h3 className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>📋 Boards</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalBoards}</p>
        </div>
        <div className={`p-4 rounded-2xl shadow text-center ${darkMode ? "bg-slate-800 text-white" : "bg-white text-black"}`}>
          <h3 className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>📝 Tasks</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalTasks}</p>
        </div>
        <div className={`p-4 rounded-2xl shadow text-center ${darkMode ? "bg-slate-800 text-white" : "bg-white text-black"}`}>
          <h3 className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>✅ Done</h3>
          <p className="text-3xl font-bold mt-2 ">{stats.completedTasks}</p>
        </div>
        <div className={`p-4 rounded-2xl shadow text-center ${darkMode ? "bg-slate-800 text-white" : "bg-white text-black"}`}>
          <h3 className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>⏳ Pending</h3>
          <p className="text-3xl font-bold mt-2 ">{stats.pendingTasks}</p>
        </div>
      </div>
      <div className={`p-8 rounded-3xl shadow-md flex flex-col gap-5 mb-10 max-w-xl mx-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <select value={icon} onChange={(e) => setIcon(e.target.value)} className={`border p-3 rounded-xl w-full ${darkMode ? "bg-slate-900 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}>
        <option value="📋">📋 General</option>
        <option value="🚀">🚀 Internship</option>
        <option value="📚">📚 Study</option>
        <option value="💼">💼 Work</option>
        <option value="🛒">🛒 Shopping</option>
        <option value="🎯">🎯 Goals</option>
        </select>
        <input
          type="text"
          placeholder="Enter board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`border p-3 rounded-xl w-full shadow-sm outline-none ${darkMode ? "bg-white text-black border-gray-300" : "bg-white border-gray-300"}`}
        />
        <input
          type="text"
          placeholder="Enter board description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`border p-3 rounded-xl w-full shadow-sm outline-none ${darkMode ? "bg-white text-black border-gray-300" : "bg-white text-black border-gray-300"}`}
        />
        <button
          onClick={createBoard}
          disabled={loading}
          className={`border p-3 rounded-xl w-full shadow-sm outline-none font-semibold transition ${darkMode ? "bg-black text-white border-gray-600 hover:bg-gray-900" : "bg-black text-white border-gray-700 hover:bg-gray-900"}`}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating...</span>
            </div>
          ) : (
            "Create Board"
          )} 
        </button>
        </div>
        <div className={`p-4 rounded-3xl shadow-md flex flex-col gap-5 mb-10 max-w-xl mx-auto ${darkMode ? "bg-slate-800" : "bg-white"}`}>
         <input
        placeholder="Search boards..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className={`border p-3 rounded-xl outline-none ${darkMode ? "bg-slate-900 text-white border-gray-600" : "bg-gray-50 text-black border-gray-300"}`}
        />
        </div>
      {filteredBoards.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-7xl mb-4">📋</div>
          <h2 className="text-3xl font-bold mb-2">No Boards Yet</h2>
          <p className="text-gray-500">Create your first board and start organizing your work.</p>
        </div>
      ) : (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {filteredBoards.map((board) => {
    const totalTasks = board.task?.length || 0;
    const completedTasks =
      board.task?.filter(
        (task) => task.status === "done"
      ).length || 0;
    const progress =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);
    return (
      <div
        key={board.id}
        className={`p-6 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white"
        }`}
      >
        <div>
          <h3
            onClick={() =>
              (window.location.href = `/tasks/${board.id}`)
            }
            className={`text-2xl font-bold cursor-pointer transition ${
              darkMode
                ? "text-white hover:text-gray-300"
                : "text-black hover:text-gray-700"
            }`}
          >
            {board.icon || "📋"} {board.title}
          </h3>
          <p
            className={`text-sm mt-4 ${
              darkMode
                ? "text-gray-300"
                : "text-gray-400"
            }`}
          >
            {board.description}
          </p>
          <div className="mt-5">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end mt-6">
              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(board);
                  }}
                  className="text-blue-500 font-semibold hover:text-blue-600 transition"
                >
                  Edit
                </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBoard(board.id);
            }}
            className="text-red-500 font-semibold hover:text-red-600 transition"
          >
            Delete
          </button>
              </div>
        </div>
      </div>
    );
  })}
</div>
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-md rounded-3xl border ${darkMode ? "border-white/10 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-900"} p-6 shadow-2xl`}
          >
            <div className="mb-5">
              <h2 className="text-2xl font-semibold">Edit Board</h2>
              <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Update the board title and description.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400">Title</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${darkMode ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
                  placeholder="Board title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className={`mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${darkMode ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
                  placeholder="Update description"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${darkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={saveBoard}
                className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18 }}
            className={`w-full max-w-md rounded-3xl border ${darkMode ? "border-white/10 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-900"} p-6 shadow-2xl`}
          >
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Invite to Board</h2>
              <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Invite a user to collaborate on this board.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400">Email</label>
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={`mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${darkMode ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className={`mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${darkMode ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
                >
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-6">
              <button
                onClick={() => setInviteModalOpen(false)}
                className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${darkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={sendInvite}
                disabled={inviteLoading}
                className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                {inviteLoading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </motion.div>
        </div>
      )} */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className={`p-8 rounded-3xl shadow-2xl w-96 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <h2 className="text-2xl font-bold mb-4">Delete Board?</h2>
            <p className="mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setBoardToDelete(null)
                }}
                className="px-4 py-2 rounded-xl bg-gray-300 text-black"
              >
                Cancel
              </button>
              <button onClick={confirmDeleteBoard} className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Boards