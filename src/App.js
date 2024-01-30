import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Vias from "./pages/Vias";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CreateVias from "./pages/CreateVias";
import EditVias from "./pages/EditVias";

function App() {
  return (
    <>
    <Router>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/profile" element={<PrivateRoute />}> 
           <Route path='/profile' element={<Profile/>}/>
        </Route>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/vias' element={<Vias/>}/>
        <Route path="/create-vias" element={<PrivateRoute/>}>
           <Route path='/create-vias' element={<CreateVias/>}/>
        </Route>
        <Route path="/edit-vias" element={<PrivateRoute/>}>
           <Route path='/edit-vias/:listingId' element={<EditVias/>}/>
        </Route>
      </Routes>
    </Router>
    <ToastContainer
      position="top-right"
      autoClose={1500}
      limit={1}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    </>
  );
}

export default App;
