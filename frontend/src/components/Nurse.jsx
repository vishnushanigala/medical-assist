import React, { useState, useEffect } from "react";
import "./css/nurse.css";
import { ToastContainer, toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Navigate,useNavigate } from "react-router-dom";

const Nurse = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/nurse/patientdata",
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if(response.data.status==="success"){
      const data = await response.data.patients;
      setPatients(data);
   
      if (data.length > 0) {
        setSelectedPatient(data[0]);
      }
    }
    else{
      throw new Error("Failed to fetch patients");
    }

    } catch (error) {
      console.error("Error fetching patients:");
      toast.error(error)
    }
  };

  const loadPatientDetails = (patientId) => {
    const patient = patients.find((p) => p._id === patientId);
    setSelectedPatient(patient);
    fetchPatients()
  };

  const handleCheckboxChange = async (medicationId, isChecked) => {
    try {
      const response = await axios.post(`http://localhost:4000/nurse/updatecheck/${medicationId}`, 
        { done: isChecked, done_time: new Date() },
        {headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }}
      );

      if (response.data.status==="success") {
        loadPatientDetails(selectedPatient._id);
        toast.success("Checked success")
      } else {
        
        toast.error("Failed to update check status")
      }
    } catch (error) {
      console.error("Error updating check status:", error);
      toast.error("Error in update check status")
    }
  };

  const handleAccessDenied = (role) => {
 
    toast.error(`Not a ${role.toUpperCase()}`);
  };

  const handleLogout=()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("role")
   
    navigate("/login")
    return ;
}


  return (
    <>
      <div className="nurse-container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-custom">
          <div className="container-fluid">
            <NavLink className="navbar-brand" href="#">
              Arogya
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" href="#">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    href="#"
                    id="receptionistid"
                    onClick={() => handleAccessDenied("Receptionist")}
                  >
                    Receptionist
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    href="#"
                    id="doctorid"
                    onClick={() => handleAccessDenied("Doctor")}
                  >
                    Doctor
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link active" href="#">
                    Nurse
                  </NavLink>
                </li>
              </ul>
              <form className="d-flex ms-auto" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                
                <button className="btn btn-danger " style={{"margin-left" : "50px"}}
                onClick={handleLogout}>
                  logout
                </button>
              </form>
            </div>
          </div>
        </nav>

        <div className="nurse-dashboard">
          <h1 className="text-center">Nurse Dashboard</h1>
          <div className="container">
            <div className="patient-selector">
              <label htmlFor="patient-select">Select Patient:</label>
              <select
                id="patient-select"
                onChange={(e) => loadPatientDetails(e.target.value)}
                value={selectedPatient?._id || ""}
                className="form-select"
              >
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <div className="patient-info card p-3 mb-4">
                <h3>Patient Details</h3>
                <p>
                  <strong>ID:</strong> {selectedPatient.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedPatient.name}
                </p>
                <p>
                  <strong>Age:</strong> {selectedPatient.age}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedPatient.gender}
                </p>
                <p>
                  <strong>Doctor:</strong> {selectedPatient.doctor}
                </p>
              </div>
            )}

            <div id="medications">
              {selectedPatient && selectedPatient.medicine.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatient.medicine.map((prescription) => {
                      const currentTime = new Date();
                      const medicationTime = new Date(prescription.time);
                      let statusClass = "";

                      if (prescription.check.done) {
                        const doneTime = new Date(prescription.check.done_time);
                        if (doneTime <= medicationTime) {
                          statusClass = "completed-on-time";
                        } else {
                          statusClass = "completed-late";
                        }
                      } else if (currentTime > medicationTime) {
                        statusClass = "time-up-unchecked";
                      }

                      return (
                        <tr key={prescription._id} className={statusClass}>
                          <td>{prescription.name}</td>
                          <td>{prescription.dosage}</td>
                          <td>
                            {new Date(prescription.time).toLocaleString()}
                          </td>
                          <td>{statusClass.replace(/-/g, " ")}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={prescription.check.done}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  prescription._id,
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>No prescription available</p>
              )}
            </div>

            <div className="legend d-flex justify-content-around mt-4">
              <div className="legend-item time-up-unchecked">
                Time Up & Unchecked
              </div>
              <div className="legend-item completed-on-time">
                Completed On Time
              </div>
              <div className="legend-item completed-late">Late but Checked</div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
};

export default Nurse;
