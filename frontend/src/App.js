import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './Home';
import Student from './Student';
import Course from './Courses';
import NavBar from './NavBar';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <NavBar/>
        <Routes>
          <Route path = '/' element ={<Home/>}/>
          <Route path = '/students' element = {<Student/>}/>
          <Route path = '/courses' element = {<Course/>}/>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
