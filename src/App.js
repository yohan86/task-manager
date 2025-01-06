import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme }  from '@mui/material';
import LoginPage from './pages/LoginPage';
import TaskManager from './pages/TaskManager';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides:{
        root:{
          input:{
            height:30,
            padding: '8px 15px',
          },
          label:{
            lineHeight:'15px'
          }
        }
        
      }
    }
  }
})



function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const handleLogin =() => {
    localStorage.setItem('IsLoggedIn', 'true');
    
    setLoggedIn(true);

  }
  useEffect(()=>{
    const loggedInStats = localStorage.getItem('IsLoggedIn');
    if(loggedInStats === 'true'){
      setLoggedIn(true);
    }else{
      setLoggedIn(false);
    }
  }, [])

 
  const deleteuser = () => {
    localStorage.removeItem('IsLoggedIn');
    localStorage.removeItem('username');
    setLoggedIn(false);
  }

  if(loggedIn === null){
    return <div>Loading...</div>
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      {!loggedIn?(<LoginPage onLogin={handleLogin}/>) 
      : (<><TaskManager /><button onClick={deleteuser}>Log out</button></>)}
    </div>
    </ThemeProvider>
  );
}

export default App;
