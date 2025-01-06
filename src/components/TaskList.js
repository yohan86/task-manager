import { useState } from 'react';
import { Grid2, Box, IconButton, List, ListItem, ListItemText, Collapse, TextField, Button } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import StyledListItem from './Styled';

const TaskList = ({ taskList, onDelete, onEdit }) => {
    const [editTaskList, setEditTaskList] = useState({});
    const [isEditing, SetIsEditing] = useState({});

    const handleUpdate = (e, index) => {
        setEditTaskList({
            ...editTaskList,
            [index]: e.target.value
        });
    }
    const handleEdit = (currindex, task) => {
        if(!editTaskList[currindex]){
            setEditTaskList({
                ...editTaskList,
                [currindex]: task
            });
            SetIsEditing((prev) =>({
                ...prev,
                [currindex]: true
            }));
        }
    }
    const closeEdit = (index) => {
        const updateValue = editTaskList[index]
        onEdit(index, updateValue);
        setEditTaskList( prev => {
            const arr = {...prev};
            delete arr[index];
            return arr;
        });
        SetIsEditing((prev) =>({
            ...prev,
            [index]: false
        }));

    }

    return (
        <List>
            {
                taskList.map((task, index) => {
                    return (
                        <StyledListItem key={index} sx={{ display: 'block' }} >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemText primary={task} />
                                <IconButton onClick={()=>handleEdit(index, task)} sx={{
                                    display: editTaskList[index] ? 'none' : 'inline-flex',
                                }}
                                    size="medium"
                                    aria-label="edit"
                                    color="secondary"


                                >
                                    <Edit />
                                </IconButton>

                                <IconButton edge='end' onClick={() => onDelete(task)}>
                                    <Delete sx={{ fill: '#544848', '&:hover': { fill: '#db4242' } }} />
                                </IconButton>
                            </Box>
                            { editTaskList[index]  &&
                                <Collapse in={true}>
                                    <Box sx={{ display: 'block', width: '100%' }} >
                                        <TextField
                                            label='Task Name'
                                            variant='outlined'
                                            value={editTaskList[index] || task}
                                            Size='medium'
                                            type='text'
                                            onChange={(e)=>handleUpdate(e, index)}
                                        />
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            onClick={()=>closeEdit(index)}
                                            disabled={!editTaskList[index] || !isEditing[index]}
                                        >Update</Button>
                                    </Box>
                                </Collapse>
                            }

                        </StyledListItem>)
                })
            }
        </List>
    )

}

export default TaskList;