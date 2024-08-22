const express=require('express');
const mongoose =require('mongoose')
const jwt=require('jsonwebtoken')
const cors=require('cors')


//MongoDB coonection
mongoose.connect(process.env.DATABASE_URL)
.then((res)=>console.log("Connected Successfully"))
.catch((err)=>console.error(err))


const app = express();
const port = process.env.PORT || 4000;

const DoctorRoutes = require('./routes/doctor.js');

const NurseRoutes =require('./routes/nurse.js');
const ReceptionistRoutes =require('./routes/receptionist.js');
const UserRoutes =require('./authorization/user.js');
const AuthMiddleware =require('./authorization/authmiddleware.js');
const { DoctorRole, ReceptionistRole, NurseRole } =require('./authorization/checkrole.js');



//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cors())



//routing
app.use('/user',UserRoutes);
app.use('/doctor', AuthMiddleware, DoctorRole, DoctorRoutes);
app.use('/nurse', AuthMiddleware, NurseRole, NurseRoutes);
app.use('/receptionist', AuthMiddleware, ReceptionistRole,ReceptionistRoutes);

app.get('/', (req, res) => {
    console.log("Home");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
