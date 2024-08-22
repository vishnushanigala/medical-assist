
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import maleImage from './images/male.jpeg'
import femaleImage from'./images/female.jpeg'

const DoctorPatient = () => {
  const [patientData, setPatientData] = useState({
    name: "",
    id: "",
    age: "",
    gender: "",
    medicine: [],
  });

  const [prescription, setPrescription] = useState({
    medicineName: "",
    dosage: "",
    time: "",
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = location.state?.patientId || null;

  useEffect(() => {
    if (patientId) {
      fillPatientData();
    }
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fillPatientData = async () => {
    try{

        
      const response = await axios.get(
        `http://localhost:4000/doctor/doctorpatientdata/${patientId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
        
        if(response.data.status=="success"){
          setPatientData(response.data.patient);
          
          const imageSrc =
          response.data.patient.gender.toLowerCase() == "female" ? femaleImage : maleImage;
         
        document.getElementById("patientImage").src = imageSrc;
        }
        else{
          toast.error("Unable to  Patient details")
        }
    }
    catch(error){
      toast.error("Unable to fetch Patient details")
    }
  };

  const handleAddPrescription = async () => {
    try{
    if (
      !prescription.medicineName ||
      !prescription.dosage ||
      !prescription.time
    ) {
      toast.error("Please fill all the fields");
      return;
    }
   
    const response = await axios.post(
      "http://localhost:4000/doctor/addprescription",
      {patientId,
        ...prescription},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
     
   
      if(response.data.status==="success"){
        setPatientData((prevData) => ({
          ...prevData,
          medicine: [...prevData.medicine, prescription],
        }));
        setPrescription({
          medicineName: "",
          dosage: "",
          time: "",
        });
        toast.success("Prescription added !.. ");
      }
      else{
        toast.error("Failed to add ");
      return;
      }
    }
    catch(error){ 
      console.error("Failed to add prescription", error)
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    alert("Form submitted successfully");
    navigate("/doctorIndex");
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

  const columns = useMemo(
    () => [
      {
        Header: "Medicine",
        accessor: "name",
      },
      {
        Header: "Dosage in mm",
        accessor: "dosage",
      },
      {
        Header: "Time",
        accessor: "time",
      },
    ],
    []
  );

  const data = useMemo(() => patientData.medicine, [patientData.medicine]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <>
      <div style={{ backgroundColor: "lightblue" }}>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Arogya
            </a>
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
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="receptionistid"
                    href="#receptionist"
                    onClick={() => handleAccessDenied("receptionist")}
                  >
                    Receptionist
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="/doctor">
                    Doctor
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="nurseid"
                    href="#nurse"
                    onClick={() => handleAccessDenied("nurse")}
                  >
                    Nurse
                  </a>
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
                  style={{ marginLeft: "50px" }}
                  onClick={handleLogout}
                >
                  logout
                </button>
              </form>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <div className="row">
            <div className="col-md-8">
              <form id="prescriptionForm" onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="text"
                    value={patientData.name}
                    id="cardname"
                    aria-label="readonly input example"
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Medicine" className="form-label">
                    Medicine
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Medicine"
                    name="medicineName"
                    value={prescription.medicineName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Dosage" className="form-label">
                    Dosage in mm
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="Dosage"
                    name="dosage"
                    value={prescription.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Time" className="form-label">
                    Time
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="Time"
                    name="time"
                    value={prescription.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  id="Add_press"
                  onClick={handleAddPrescription}
                >
                  Add Prescription
                </button>
                <button type="submit" id="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>

              <table {...getTableProps()} className="table mt-4">
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-md-4">
              <div className="card" id="patientCard">
                <img
                  src=""
                  id="patientImage"
                  className="card-img-top"
                  alt="Patient"
                  style={{"height" : "250px","width" : "250px " }}
                />
                <div className="card-body">
                  <p className="card-text" id="patientName">
                    Patient Name: {patientData.name}
                  </p>
                  <p className="card-text" id="patientId">
                    Patient Id: {patientData.id}
                  </p>
                  <p className="card-text" id="patientAge">
                    Age: {patientData.age}
                  </p>
                  <p className="card-text" id="patientGender">
                    Gender: {patientData.gender}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
};

export default DoctorPatient;
