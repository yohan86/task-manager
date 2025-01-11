import { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile  } from 'firebase/auth';
import { auth, GoogleAuthProvider } from './firebase';
import { Button, Typography, Box, Container, TextField } from '@mui/material';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError('Failed to sign in with Google');
    }
  };

  // Handle Email and Password login or registration
  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error message

    try {
      if (isLogin) {
        // Log in with email and password
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Register with email and password
        await createUserWithEmailAndPassword(auth, email, password);
        const userCredential = auth.currentUser; 
        if(displayName){
            await updateProfile(userCredential, {
                displayName:displayName,
            });
        }
      }
    } catch (error) {

      switch(error.code){
        case 'auth/weak-password':
            setError('Password should be at least 6 characters');
        default:
            setError(error.message);
      }
    }
  }






  return (
    <Container maxWidth="xs" sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        {isLogin ? 'Log In' : 'Register'}
      </Typography>

      {/* Display any error messages */}
      {error && <Typography color="error" variant="body2" align="center">{error}</Typography>}

      {/* Email and Password Form */}
      {!isLogin && (
        <Box component="form" 
             onSubmit={handleEmailPasswordSubmit} 
             sx={{ display: 'flex', flexDirection: 'column' }}
        >
            <TextField 
                label='Display Name' 
                type='text' 
                variant='outlined' 
                fullWidth 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
            />
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
            {isLogin ? 'Log In' : 'Register'}
          </Button>
        </Box>
      )}

      {/* Google Sign-In Button */}
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGoogleSignIn}
        >
          Sign In with Google
        </Button>
      </Box>

      {/* Toggle between login and register */}
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Button color="secondary" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Log In'}
        </Button>
      </Box>
    </Container>
  );
};

export default AuthForm;
