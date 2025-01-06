import { useState } from 'react';
import { Button, TextField, Box, Typography, Paper, Alert } from '@mui/material';

const LoginPage = ({onLogin})=> {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const defaultUser = 'admin';
    const defaultPassword = 'admin';


    const handleSubmit =(e)=> {
        e.preventDefault();
        if( username === defaultUser && password === defaultPassword ){
            
            localStorage.setItem('username', username);
            onLogin();

        }else{
            setError('Invalid username or password');
        }
    }

    return (
        <Paper elevation={6} sx={{ maxWidth: 450, padding: 2, margin: '50px auto' }}>
            <Box sx={{ maxWidth: 400, margin: '20px auto' }}>
                <Typography variant='h4' gutterBottom>Login</Typography>

                {error && (
                    <Alert severity='error' sx={{ margin:'15px 0'}}>{error}</Alert>
                )}
                <form onSubmit={handleSubmit}> 
                    <TextField
                        label='Username'
                        variant='outlined'
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ marginBottom: 2 }}
                        className='form_field'
                    />
                    <TextField
                        label='Password'
                        variant='outlined'
                        fullWidth
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ marginBottom: 2 }}
                        className='form_field'
                    />
                    <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Paper>


    )

}
export default LoginPage;