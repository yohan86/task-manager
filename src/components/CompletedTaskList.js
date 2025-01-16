import {List, ListItem, Box, ListItemText, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const CompletedTaskList = ({taskList, onDelete}) =>{

    const deleteCompletedTask = (index) => {
        
        onDelete(index);
    }

return (
    <List>

        {
        Object.keys(taskList).map((index) => {
            const task = taskList[index];
            return (
                <ListItem key={index} sx={{border:'1px solid #ccc', borderRadius:3, marginBottom:2}}>
                    <ListItemText primary={task.name} />
                    <IconButton onClick={() =>deleteCompletedTask(index)}>
                        <Delete sx={{ fontSize:18, fill:'#ccc', '&:hover':{fill:'#ff0000'}}}/>
                    </IconButton>
                </ListItem>
            )
        })
        }

        
    </List>
)



}

export default CompletedTaskList;