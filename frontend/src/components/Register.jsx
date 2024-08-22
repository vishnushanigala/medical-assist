import React, { useState } from "react";
import "./css/register.css";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const user = { email, username, password, role };
      
      const response = await axios.post("http://localhost:4000/user/register", user);
      
      if (response.data.status === "success") {
        toast.success("Registration Successful", {
          autoClose : 2000,
          onClose: () => {
            navigate("/login");
          },
        });

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Internal Error");
    }
  };

  return (
    <>
      <div className="register">
        <div className="container">
          <h2>Register</h2>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="receptionist">Receptionist</option>
          </select>

          <button type="button" onClick={handleRegister}>
            Register
          </button>
          <p>
            Already have an account? <NavLink to="/login">Login</NavLink>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}

export default Register;
