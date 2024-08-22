import Login from './components/Login';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Register from './components/Register';
import Nurse from './components/Nurse';
import Receptionist from './components/Receptionist';
import DoctorIndex from './components/DoctorIndex';
import DoctorPatient from './components/DoctorPatient';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login/>}/>
        <Route  path='/login' element={<Login/>}/>
        <Route  path='/register' element={<Register/>}/>
        <Route  path='/nurse' element={<Nurse/>}/>
        <Route  path='/receptionist' element={<Receptionist/>}/>
        <Route  path='/doctorIndex' element={<DoctorIndex/>}/>
        <Route  path='/doctorPatient' element={<DoctorPatient/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
