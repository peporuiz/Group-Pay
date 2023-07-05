import React, {useState} from 'react';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Group from './components/Group';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import background from "../src/components/images/fondo.jpg"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App" style={{ backgroundImage: `url(${background})`, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isLoggedIn ? <Group /> : <Login setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
};

export default App;



