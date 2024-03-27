import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ChatApp from './pages/ChatApp';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/loginPage' Component={LoginPage} />
        <Route path='/' Component={Home} />
        <Route path='/chatPage' Component={ChatApp}/>
      </Routes>
    </div>

  );
}

export default App;
