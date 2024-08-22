import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Navigate,useNavigate } from "react-router-dom";

const DoctorIndex = () => {
  const [patients, setPatients] = useState([]);
  const navigate=useNavigate()
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/doctor/data",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        const data = await response.data.patients;
        setPatients(data);
         
      
      } else {
        throw new Error("Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:");
      toast.error(error);
    }
  };

  const handleButtonClick = (patientId) => {
    navigate("/doctorPatient",{state :{ patientId : patientId}})
  };
  const handleAccessDenied = (role) => {
    toast.error(`Not a ${role.toUpperCase()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
    return;
  };

  return (
    <>
      <div className="index">
        <div style={{ backgroundColor: "lightblue", minHeight: "100vh" }}>
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <NavLink className="navbar-brand" to="#">
                Arogya
              </NavLink>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <NavLink className="nav-link" aria-current="page" to="#">
                      Home
                    </NavLink>
                  </li>
                  <li
                    className="nav-item"
                    onClick={() => handleAccessDenied("receptionist")}
                  >
                    <NavLink className="nav-link" to="#">
                      Receptionist
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link active" to="#">
                      Doctor
                    </NavLink>
                  </li>
                  <li
                    className="nav-item"
                    onClick={() => handleAccessDenied("nurse")}
                  >
                    <NavLink className="nav-link" to="#">
                      Nurse
                    </NavLink>
                  </li>
                </ul>
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button
                    className="btn btn-danger "
                    style={{ "margin-left": "50px" }}
                    onClick={handleLogout}
                  >
                    logout
                  </button>
                </form>
              </div>
            </div>
          </nav>

          <h1 className="text-center">Doctor Management System</h1>
          <div className=" container">
            <table id="patientTable" className="table">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Patient Name</th>
                  <th>Patient ID</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Click here</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={patient._id}>
                    <td>{index + 1}</td>
                    <td>{patient.name}</td>
                    <td>{patient.id}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.age}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => handleButtonClick(patient._id)}
                      >
                        Click here
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
};

export default DoctorIndex;
