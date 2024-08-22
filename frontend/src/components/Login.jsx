import React, { useState } from "react";
import "./css/login.css";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    try {
      const user = { email, password, role };
      
      const response = await axios.post("http://localhost:4000/user/login", user);
      localStorage.setItem("token",response.data.token);
      
      localStorage.setItem("role",role);
  
      if (response.data.status === "success") {
        toast.success("Login Successful");
        if(role==="doctor")
          navigate("/doctorIndex")
        else if(role==="nurse")
          navigate("/nurse")
        else 
          navigate("/receptionist")

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Internal Error");
    }
  };

  return (
    <>
      <div className="login">
        <div className="container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select
              name="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="receptionist">Receptionist</option>
            </select>
            <button type="submit">Login</button>
            <p>
              Don't have an account? <NavLink to="/register">Register</NavLink>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={4000}  />
    </>
  );
}

export default Login;
