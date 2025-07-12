
const firebaseErrors= (error)=> {
    const code = error.code;
    const errorMessage = {
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Incorrect credential. Please try again.",
        "auth/email-already-in-use": "This email is already registered.",
        "auth/weak-password": "Password should be at least 6 characters.",
        "auth/network-request-failed": "Network error. Please check your connection.",
    };
  return errorMessage[code];
  
}

export default firebaseErrors