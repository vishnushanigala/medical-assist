const express = require( 'express');
const PatientModel = require('../models/HospitalModel.js');
// import path from 'path';


const router = express.Router();

router.get('/data', async (req, res) => {
    try {
        const patients = await PatientModel.find();
        
        res.send(patients);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/addpatient', async (req, res) => {
    try {
        const existed_user = await PatientModel.findOne({"id" : req.body.id})
      
        if(existed_user){
            res.json({"status" : "fail","message" : "Id already Exists"});
            return ;
        }
        const patient = new PatientModel(req.body);
        await patient.save();
        res.json({"status" : "success",patient});
    } catch (error) {
        res.json({"status" : "fail"});
    }
});

module.exports= router;