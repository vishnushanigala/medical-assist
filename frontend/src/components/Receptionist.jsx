import React, { useState, useEffect } from "react";
import "./css/receptionist.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Receptionist = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    id: "",
    name: "",
    gender: "Male",
    age: "",
    doctor: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/receptionist/data",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPatients(response.data); // Assuming response.data is the array of patients
    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast.error("Failed to fetch patients");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/receptionist/addpatient",
        patientData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Patient added successfully");
        fetchPatients(); // Refresh the patient list
        setPatientData({
          id: "",
          name: "",
          gender: "Male",
          age: "",
          doctor: "",
        }); // Reset the form fields
      } else {
        toast.error(response.data.message || "Failed to add patient");
      }
    } catch (error) {
      console.error("Error adding new patient:", error);
      toast.error("Error in adding patient");
    }
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
      <div className="receptionist container-fluid">
        <nav className="receptionist navbar navbar-expand-lg navbar-light bg-light navbar-custom">
          <a className="receptionist navbar-brand" href="#">
            Arogya
          </a>
          <button
            className="receptionist navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="receptionist navbar-toggler-icon"></span>
          </button>
          <div className="receptionist collapse navbar-collapse" id="navbarNav">
            <ul className="receptionist navbar-nav">
              <li className="receptionist nav-item">
                <a className="receptionist nav-link" href="#">
                  Home
                </a>
              </li>
              <li className="receptionist nav-item">
                <a
                  className="receptionist nav-link active"
                  href="/receptionist"
                >
                  Receptionist
                </a>
              </li>
              <li className="receptionist nav-item">
                <a
                  className="receptionist nav-link"
                  href="#"
                  onClick={() => handleAccessDenied("doctor")}
                >
                  Doctor
                </a>
              </li>
              <li className="receptionist nav-item">
                <a
                  className="receptionist nav-link"
                  href="#"
                  onClick={() => handleAccessDenied("nurse")}
                >
                  Nurse
                </a>
              </li>
            </ul>
            <form className="receptionist d-flex ms-auto" role="search">
              <input
                className="receptionist form-control me-2"
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
        </nav>

        <div className="receptionist container mt-4">
          <h1 className="receptionist text-center mb-4">
            Patient Management System
          </h1>
          <div className="receptionist row">
            <div className="receptionist col-lg-8 col-md-10 mx-auto">
              <form
                id="patientForm"
                onSubmit={handleSubmit}
                className="receptionist p-4 border rounded bg-white shadow-sm"
              >
                <h4 className="receptionist mb-4">Add New Patient</h4>
                <div className="receptionist mb-3">
                  <label htmlFor="id" className="receptionist form-label">
                    ID
                  </label>
                  <input
                    type="number"
                    className="receptionist form-control"
                    id="id"
                    value={patientData.id}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="receptionist mb-3">
                  <label htmlFor="name" className="receptionist form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="receptionist form-control"
                    id="name"
                    value={patientData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="receptionist mb-3">
                  <label htmlFor="gender" className="receptionist form-label">
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="receptionist form-control"
                    value={patientData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="receptionist mb-3">
                  <label htmlFor="age" className="receptionist form-label">
                    Age
                  </label>
                  <input
                    type="text"
                    className="receptionist form-control"
                    id="age"
                    value={patientData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="receptionist mb-3">
                  <label htmlFor="doctor" className="receptionist form-label">
                    Doctor
                  </label>
                  <input
                    type="text"
                    className="receptionist form-control"
                    id="doctor"
                    value={patientData.doctor}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="receptionist btn btn-primary">
                  Add Patient
                </button>
              </form>

              <div className="receptionist mt-4">
                <h4 className="receptionist text-center mb-3">Patient List</h4>
                <table
                  id="patientTable"
                  className="receptionist table table-striped table-bordered"
                >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Doctor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.age}</td>
                        <td>{patient.doctor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
};

export default Receptionist;
