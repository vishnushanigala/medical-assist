const express = require( 'express');
const PatientModel = require('../models/HospitalModel.js');
// import path from 'path';

const router = express.Router();


router.get('/data', async (req, res) => {
    try {
        const patients = await PatientModel.find();
        res.json({"status" : "success" ,patients});
    } catch (error) {
        res.json({"status" : "fail" ,"message" : "Error in Fetching data"});
    }
});

router.post('/addprescription', async (req, res) => {
    try {
        
        const { patientId, medicineName, dosage, time } = req.body;
        const patient = await PatientModel.findById(patientId);
        
        if (!patient) {
            res.json({"status" : "fail" ,"message" : "Patient not found"});
            return ;
        }

        // Include the check object with done status in the prescription data
        patient.medicine.push({
            name: medicineName,
            dosage: dosage,
            time: time
        });

        await patient.save();
        res.json({"status" : "success"});
    } catch (err) {
        res.json({"status" : "fail" ,"message" : "Error in adding"});
    }
});


router.get('/doctorpatientdata/:id', async (req, res) => {
    try {
       
        const patient = await PatientModel.findById(req.params.id);
      
        res.json({"status":"success",patient});
    } catch (error) {
        res.json({"status":"fail","message" : "Error in fetching patient details"});
    }
});

module.exports= router;
