import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/boards"
          element={<Boards />}
        />
        <Route
          path="/tasks/:id"
          element={<Tasks />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
      />
    </BrowserRouter>
  );
}
export default App;