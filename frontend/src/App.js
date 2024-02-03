import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NavigationBar from './NavBar';
import Home from './Home';
import Student from './Student';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavigationBar/>
        <Routes>
          <Route path = '/' element ={<Home/>}/>
          <Route path = '/students' element = {<Student/>}/>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
