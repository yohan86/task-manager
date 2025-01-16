import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, Box, Button }  from '@mui/material';
import TaskManager from './pages/TaskManager';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/firebase';
import AuthForm from './components/AuthForm';
import Header from './components/Header';


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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState(null);

  useEffect(()=> {
    const loginStatus =  onAuthStateChanged( auth, (current) => {
      if(current){
        const addedUser = current.displayName || current.email;
        setUser(addedUser);
        console.log('aaaa', current.displayName)
        setLoading(false);
      }else{
        setUser(null);
      }
      
    }) 
    console.log('sdsd', user)
    return ()=> loginStatus;
  }, [])

 if(loading){
  return <Box sx={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'18px', fontWeight:'bold'}}>Loading, please wait!!!</Box>
 }

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <Header userName={user} />
      {user ? (<TaskManager />): <AuthForm />}
    </div>
    </ThemeProvider>
  );
}

export default App;
