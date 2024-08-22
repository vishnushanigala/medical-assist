const express = require( 'express');
const PatientModel = require('../models/HospitalModel.js');
// import path from 'path';

// let __dirname = path.resolve();

const router = express.Router();

// router.get('/', async (req, res) => {
//     res.sendFile(path.join(__dirname, "/Frontend/nurse/nurseindex.html"));
// });

router.get('/patientdata', async (req, res) => {
    try {
        const patients = await PatientModel.find();
        res.json({"status" : "success" ,patients});
    } catch (error) {
        res.json({"status" : "fail" ,"message" : "Error in Fetching data"});
    }
});

router.post('/updatecheck/:id', async (req, res) => {
    try {
        const medicationId = req.params.id;
        const { done,done_time } = req.body;
       
        // Find the patient containing this medication
        const patient = await PatientModel.findOne({ 'medicine._id': medicationId });

        if (!patient) {
            return res.json({ "status" : "success","message": 'Medication not found' });
        }

        // Update the check status of the medication
        let medication = patient.medicine.id(medicationId);

        // Update the check object properties separately
       
        if (done !== undefined) {
            medication.check.done = done;
        }
        if (done_time !== undefined) {
            medication.check.done_time = done_time ? new Date() : null;
        }

        await patient.save();

        res.json({"status" : "success", message: 'Check status updated successfully' });
    } catch (error) {
        console.error(error);
         res.json({ "status" : "success","message": 'Internal Error' });

    }
});

module.exports= router;