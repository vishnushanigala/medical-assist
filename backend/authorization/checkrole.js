let DoctorRole = (req, res, next) => {
    
     if(req.role === 'doctor') {
        
        next();
    } else {
        res.status(401).json({ "status" : "fail", "message": "Not athorized" })
    }

}

let ReceptionistRole = (req, res, next) => {
    if(req.role === 'receptionist') {
   
        next();
    } else {
        res.status(401).json({ "status" : "fail", "message": "Not athorized" })
    }
}

let NurseRole = (req, res, next) => {
    if(req.role === 'nurse') {
        next();
    } else {
        res.status(401).json({ "status" : "fail", "message": "Not athorized" })
    }
}

module.exports= { DoctorRole, ReceptionistRole, NurseRole };