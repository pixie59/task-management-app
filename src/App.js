import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./entry/Login"
import Boards from "./entry/Board"
import Tasks from "./entry/Tasks"
function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/boards" element={<Boards/>}/>
        <Route path="/tasks/:id" element={<Tasks/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
