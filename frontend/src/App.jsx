import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import SignUp from "./pages/Signup"
import Dashboard from "../src/pages/Dashboard";
import USers from "../src/pages/Users";
import ProductsDashboard from "../src/pages/ProductsDashboard";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/dashboard/users" element={<USers />} />
        <Route path="/dashboard/products/*" element={<ProductsDashboard />} />
      </Routes>
    </Router>
  );
}
