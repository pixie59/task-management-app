import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./entry/Login"
import Boards from "./entry/Board"
import Tasks from "./entry/Tasks"
import Profile from "./Profile"
function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/boards" element={<Boards/>}/>
        <Route path="/tasks/:id" element={<Tasks/>}/>
         <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
