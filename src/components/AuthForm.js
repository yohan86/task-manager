import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [viewLogin, setViewLogin] = useState(true);
    const [displayName, setDisplayName] = useState(null);

    const registerPerson = async () => {
        try {
            const createUser = await createUserWithEmailAndPassword(auth, email, password);
            console.log('done');
            const user = createUser.user;
            if (displayName === null) {
                setDisplayName(user.email);
            }
            console.log('usr', user)
            await updateProfile(user, { displayName });



        } catch (error) {
            setError(error.message);
        }
    }

    const loginUser = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("user logged In", email)
        } catch (error) {
            setError(error.message);
        }
    }
    const SubmitForm = () => {
        if (viewLogin) {
            loginUser();
        } else {
            registerPerson();
        }

    }

    return (
        <>
            <Box container='true'
                sx={{
                    width: '370px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '30px auto'
                }}>
                <Typography variant='h3' fontSize='25px' marginBottom='20px'>
                    {viewLogin ? 'Sign In' : 'Sign Up'}
                </Typography>

                {error && <Box sx={{ color: '#ff0000' }}>{error}</Box>}

                {!viewLogin && (
                    <>
                        <TextField
                            fullWidth
                            variant='outlined'
                            label='Display Name'
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </>
                )}
                <TextField
                    fullWidth
                    variant='outlined'
                    type='email'
                    label='Email'
                    margin='normal'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    gap='2'
                />
                <TextField
                    fullWidth
                    variant='outlined'
                    type='password'
                    label='Password'
                    margin='normal'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant='contained'
                    color='primary'
                    onClick={SubmitForm}
                    sx={{ marginTop: '15px' }}
                >
                    {viewLogin ? 'Login' : 'Register'}
                </Button>

                <Box onClick={() => setViewLogin(!viewLogin)} marginTop='10px' >
                    {viewLogin ?
                        <Box sx={{ display: 'flex' }}>
                            Don't have an account?
                            <Box sx={{ color: '#1565c0', marginLeft: '5px', cursor: 'pointer' }}>
                                Sign Up
                            </Box>
                        </Box> :
                        <Box sx={{ display: 'flex' }}>
                            Already have an account?
                            <Box sx={{ color: '#1565c0', marginLeft: '5px', cursor: 'pointer' }}>
                                Login
                            </Box>
                        </Box>
                    }
                </Box>

            </Box>
        </>
    )
}

export default AuthForm;