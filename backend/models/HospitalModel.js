const mongoose = require( 'mongoose');
const dotenv = require('dotenv');

dotenv.config();


const PatientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    id: Number,
    date: Date,
    time: String,
    doctor: String,
    medicine: [
        {
            name: String,
            dosage: Number,
            time: String,
            check: {
                done: {
                    type: Boolean,
                    default: false
                },
                done_time: {
                    type: Date,
                    default: null
                }
            }
        }
    ],
    disease: String
});

const PatientModel = mongoose.model('Patient', PatientSchema);

module.exports= PatientModel;

