import { useState, useCallback, useRef } from 'react';
import {
    Grid2, Box, IconButton, List, ListItem, ListItemText, Collapse, TextField, Button, FormControl,
    Select, MenuItem, InputLabel, Checkbox, FormControlLabel, checkboxClasses
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import StyledListItem from './Styled';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';

const TaskList = ({ taskList, onDelete, onEdit, onCompleted }) => {
    const [editTaskList, setEditTaskList] = useState({});
    const [isEditing, SetIsEditing] = useState({});
    const [date, setDate] = useState(dayjs());
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
        }else{
            setEditTaskList(prev => {
                const arr = { ...prev };
                delete arr[currindex];
                return arr;
            });
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
        onEdit(index, updateItem.name, updateItem.priority, updateItem.status, updateItem.dueDate);

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

    return (
        <List>
            {
                Object.keys(taskList).map((index) => {
                    const task = taskList[index];
                    
                        return (
                        <StyledListItem key={index} sx={{ display: 'block', boxShadow: 8 }} >
                            <Box display='inline-block'
                                sx={{ 
                                    fontSize: 12, 
                                    backgroundColor: setBgColor(task.priority), 
                                    padding: '2px 10px 3px', 
                                    borderRadius: 5 
                                    }}
                            >
                                {task.priority}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemText primary={task.name} sx={{ padding: '5px' }} />
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #fff' }}>
                                <Box>Due Date: {dayjs(task.dueDate).isValid()? task.dueDate :'No' }</Box>
                                <Box>
                                <FormControlLabel 
                                    sx={{ 
                                        fontSize: '10px', 
                                        marginLeft: '5px', 
                                        '& .MuiFormControlLabel-label': { fontSize: '12px' } 
                                    }}
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
                            </Box>
                            
                            {editTaskList[index] &&
                                <Collapse in={true}>
                                    <Box sx={{ display: 'block', width: '100%', paddingBottom:'10px' }} >
                                    <IconButton sx={{float:'right'}} >
                                        <CloseIcon 
                                        sx={{color:"#fff"}}
                                        onClick={() => handleEdit(index, task)} />
                                    </IconButton>
                                        <TextField
                                            label='Task Name'
                                            variant='outlined'
                                            value={editTaskList[index]?.name || task.name}
                                            size='medium'
                                            type='text'
                                            onChange={(e) => handleUpdateTaskName(e, index)}
                                            fullwidth
                                            sx={{
                                                width:'100%', 
                                                '& label':{color:'#181010', fontSize:'17px'}, 
                                                '& input':{color:'#fff'} 
                                            }}
                                        />
                                        <Box sx={{display:'flex', margin:'20px 0'}}>
                                        <FormControl variant='outlined'>
                                            <InputLabel sx={{ color:'#181010', fontSize:'17px' }}>Priority</InputLabel>
                                            <Select
                                                value={editTaskList[index]?.priority || task.priority}
                                                onChange={(e) => handlePriorityChange(e, index)}
                                                label="Priority"
                                                sx={{
                                                    color:'#fff', 
                                                    width:'230px',
                                                    marginRight:'10px',
                                                    '& label':{color:'#181010', fontSize:'17px'},
                                                    '& .MuiSelect-select':{padding:'11.5px'}, 
                                                    '& .MuiSelect-icon':{color:'#fff'}}}
                                            >
                                                {priorities.map((priority) => (
                                                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Due Date"
                                                value={editTaskList[index]?.dueDate && dayjs(editTaskList[index]?.dueDate).isValid() ? dayjs(editTaskList[index]?.dueDate) : null } // Ensure valid date

                                                format="MM - DD - YYYY"
                                                onChange={(due) => {
                                                    setEditTaskList((prev)=>({
                                                        ...prev,
                                                        [index]:{...prev[index], dueDate: dayjs(due).isValid() ? dayjs(due).format('MMM/DD/YYYY'): null}
                                                    }))
                                                    console.log(due)
                                                }}
                                                sx={{
                                                    marginLeft:'25px', 
                                                    '& label':{color:'#181010', fontSize:'17px'}, 
                                                    '& input':{color:'#fff'}, 
                                                    '& .MuiIconButton-root':{color:'#fff'}
                                                }}
                                            />
                                        </LocalizationProvider>

                                        </Box>
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