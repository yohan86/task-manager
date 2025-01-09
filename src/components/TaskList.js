import { useState, useCallback, useRef } from 'react';
import {
    Grid2, Box, IconButton, List, ListItem, ListItemText, Collapse, TextField, Button, FormControl,
    Select, MenuItem, InputLabel, Checkbox, FormControlLabel, checkboxClasses
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import StyledListItem from './Styled';

const TaskList = ({ taskList, onDelete, onEdit, onCompleted }) => {
    const [editTaskList, setEditTaskList] = useState({});
    const [isEditing, SetIsEditing] = useState({});
    const priorities = ["Low", "Medium", "High"];

    const setBgColor = (priorityVal) => {
        switch (priorityVal) {
            case 'High':
                return '#f02323';
            case 'Medium':
                return '#d0d812';
            default:
                return '#666';
        }
    }

    const taskNameDebounceTimeout = useRef(null);

    const handleUpdateTaskName = (e, index) => {
        const updatedName = e.target.value;
        setEditTaskList((prev) => ({
            ...prev,
            [index]: { ...prev[index], name: e.target.value }, // Set the updated task at the given index
        }));

        clearTimeout(taskNameDebounceTimeout.current);

        taskNameDebounceTimeout.current = setTimeout(() => {
            setEditTaskList((prev) => ({
                ...prev,
                [index]: { ...prev[index], name: e.target.value }, // Set the updated task at the given index
            }));
        }, 300);

    };

    const handleEdit = (currindex, task) => {
        if (!editTaskList[currindex]) {
            setEditTaskList({
                ...editTaskList,
                [currindex]: { ...task },
            });
            SetIsEditing((prev) => ({
                ...prev,
                [currindex]: true,
            }));
        }
    }

    const handlePriorityChange = (e, index) => {
        const updatedPriority = e.target.value;
        const updatedTask = { ...editTaskList[index], priority: updatedPriority }

        setEditTaskList((prev) => ({
            ...prev,
            [index]: updatedTask,
        }));

    };

    const closeEdit = (index) => {
        const updateItem = editTaskList[index];
        onEdit(index, updateItem.name, updateItem.priority, updateItem.status);

        setEditTaskList(prev => {
            const arr = { ...prev };
            delete arr[index];
            return arr;
        });
        SetIsEditing((prev) => ({
            ...prev,
            [index]: false,
        }));

    };

    //on completed task handle
    const handleCompletedTask = (e, index) => {
        const checked = e.target.checked;
        if(checked){
            onCompleted(index);
        }
        
    }

    //const activeTasks = Object.values(taskList).filter(task => task.status !== 'completed');

    return (
        <List>
            {
                
                Object.keys(taskList).map((index) => {
                    const task = taskList[index];
                    
                        return (
                        <StyledListItem key={index} sx={{ display: 'block', boxShadow: 8 }} >
                            <Box display='inline-block'
                                sx={{ fontSize: 12, backgroundColor: setBgColor(task.priority), padding: '2px 10px 3px', borderRadius: 5 }}>
                                {task.priority}{task.status}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemText primary={task.name} sx={{ padding: '5px' }} />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', borderTop: '1px solid #fff' }}>

                                <FormControlLabel sx={{ fontSize: '10px', marginLeft: '5px', '& .MuiFormControlLabel-label': { fontSize: '12px' } }}
                                    value="end"
                                    control={<Checkbox 
                                        sx={{
                                        color: '#fff', 
                                        [`&.${checkboxClasses.checked}`]: {
                                            color: '#74db42',
                                        },
                                    }}
                                    onChange={(e)=>handleCompletedTask(e, index)}
                                    size="small" />}
                                    label="Completed"
                                    labelPlacement="end"
                                />
                                <IconButton onClick={() => handleEdit(index, task)} sx={{
                                    display: editTaskList[index] ? 'none' : 'inline-flex', fontSize: 15,
                                }}
                                    aria-label='edit'
                                    color='secondary'
                                >
                                    <Edit sx={{ fontSize: 18, fill: '#544848', '&:hover': { fill: '#fff' } }} />
                                </IconButton>

                                <IconButton edge='end' onClick={() => onDelete(index)} >
                                    <Delete sx={{ fontSize: 18, fill: '#db4242', '&:hover': { fill: '#fff' } }} />
                                </IconButton>



                            </Box>


                            {editTaskList[index] &&
                                <Collapse in={true}>
                                    <Box sx={{ display: 'block', width: '100%' }} >

                                        <FormControl variant='outlined' fullWidth>
                                            <InputLabel>Priority</InputLabel>
                                            <Select
                                                value={editTaskList[index]?.priority || task.priority}
                                                onChange={(e) => handlePriorityChange(e, index)}
                                                label="Priority"
                                            >
                                                {priorities.map((priority) => (
                                                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label='Task Name'
                                            variant='outlined'
                                            value={editTaskList[index]?.name || task.name}
                                            size='medium'
                                            type='text'
                                            onChange={(e) => handleUpdateTaskName(e, index)}
                                        />
                                        <TextField
                                            label="Due Date"
                                            type="date"
                                        />
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            onClick={() => closeEdit(index)}
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