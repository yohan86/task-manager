import { Box, Typography } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useEffect } from 'react';
import { NoEncryption } from '@mui/icons-material';


const Header = ({userName}) => {
    const handleLogOut = async () => {
        try{
            await signOut(auth);
        }catch(error){

        }
    }

    return (
        <Box
            
            sx={{
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'right',
                background: '#1565c0',
                color: '#fff',
                padding: '8px 10px'
            }}
        >
            <Typography
                fontSize='16px'
                sx={{ marginRight: '10px' }}
                variant='h4'
            >
                Welcome { userName !== null ? userName : 'to Task Manger' }!
            </Typography>
            { userName && userName !== null &&
                <Box
                    fontSize='15px'
                    sx={{ display: 'flex', alignItems: 'center' }}
                    variant='h4'
                    onClick={handleLogOut}
                >
                    <Typography sx={{ display:{xs:'none', md:'inline-block'}, margin: '0 10px 0 20px' }}>Log Out</Typography>
                    <PowerSettingsNewIcon />
                </Box>
            }
        </Box>
        
    )
}

export default Header;