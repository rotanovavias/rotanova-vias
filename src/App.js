import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Vias from "./pages/Vias";
import ForgotPassword from "./pages/ForgotPassword";
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/vias' element={<Vias/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;