import { useState, useCallback, useRef } from 'react';
import {
    Grid2, Box, IconButton, List, ListItem, ListItemText, Collapse, TextField, Button, FormControl,
    Select, MenuItem, InputLabel, Checkbox, FormControlLabel, checkboxClasses, Dialog, DialogActions,DialogContent, DialogTitle
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import StyledListItem from './Styled';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ProviderId } from 'firebase/auth';

const TaskList = ({ taskList, onDelete, onEdit, onCompleted }) => {
    const [editTaskList, setEditTaskList] = useState({});
    const [isEditing, SetIsEditing] = useState({});
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
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


    const handleDeletePopup= (index) => {
        setOpenDeletePopup(true);
        setTaskToDelete(index);
    }
    const handleDelete = () => {
        setOpenDeletePopup(false);
        onDelete(taskToDelete);
        setTaskToDelete(null);
    }
    const handleDeletePopupCancel = () => {
        setOpenDeletePopup(false);
        setTaskToDelete(null);
    }

    //drag and drop
    const handleDraggOn = (result) => {
        const {destination, source } = result;

        if(!destination) return
        const reArrangedTasks =  Array.from(taskList);
        const [draggItem] = reArrangedTasks.splice(source.index, 1);
        reArrangedTasks.splice(destination.index, 0, draggItem);

        onEdit(reArrangedTasks);
    }


    return (
        <>
        <DragDropContext onDragEnd={handleDraggOn}>
        <Droppable droppableId='taskList' isDropDisabled={false}>
        {(provided) => ( 
        <List
            {...provided.droppableProps}
            ref={provided.innerRef}
        >
            {
                Object.keys(taskList).map((index) => {
                    const task = taskList[index];
                    
                        return (
                        <Draggable key={index} draggableId={JSON.stringify(index)} index={index}>
                        {(provided) => (
                        
                        <StyledListItem 
                            ref = {provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            key={index} sx={{ display: 'block', boxShadow: 8 }} >
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
                                <Box sx={{fontSize:{xs:12, md:14}}}>Due Date: {dayjs(task.dueDate).isValid()? task.dueDate :'No' }</Box>
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
                                <IconButton onClick={() => handleEdit(index, task)} 
                                sx={{
                                    display: editTaskList[index] ? 'none' : 'inline-flex', padding:{xs:0}
                                }}
                                    aria-label='edit'
                                    color='secondary'
                                >
                                    <Edit sx={{ fontSize:{xs:20, sm:15, md:15}, fill: '#544848', '&:hover': { fill: '#fff' } }} />
                                </IconButton>

                                <IconButton edge='end' onClick={() => handleDeletePopup(index)} sx={{padding:{xs:1}}} >
                                    <Delete sx={{ fontSize:{xs:20, sm:18, md:18}, fill: '#db4242', '&:hover': { fill: '#fff' } }} />
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
                                        <Box sx={{display:'flex', flexDirection:{xs:'column', md:'row'}, margin:'20px 0'}}>
                                        <FormControl variant='outlined'>
                                            <InputLabel sx={{ color:'#181010', fontSize:'17px' }}>Priority</InputLabel>
                                            <Select
                                                value={editTaskList[index]?.priority || task.priority}
                                                onChange={(e) => handlePriorityChange(e, index)}
                                                label="Priority"
                                                sx={{
                                                    color:'#fff', 
                                                    width:{xs:'100%', md:'230px'},
                                                    marginRight:{xs:'0', md:'10px'},
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
                                                    width:{xs:'100%', md:'230px'},
                                                    marginLeft:{xs:'0', md:'25px'},
                                                    marginTop:{xs:'25px', md:0},
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
                       
                        </StyledListItem>
                        
                            
                    )}

                    </Draggable>)
                })
            
            }
            
            {provided.placeholder}
        </List>
        )}

        </Droppable>
        </DragDropContext>

        <Dialog open={openDeletePopup} sx={{borderRadius:'5px', '& .MuiDialog-paper':{width:'300px', paddingBottom:'10px'}}}>
            <DialogTitle 
            sx={{
                background:'#6193cc', 
                color:'#fff',
                padding:'6px 10px',
                fontSize:'16px'
                }}>
                Confirm Delete
            </DialogTitle>
            <DialogContent sx={{margin:'20px 0 10px', fontSize:'14px'}}>
                Are you sure you want to delete this task? This action can not be undone.
            </DialogContent>
            <DialogActions sx={{justifyContent:'center'}}>
                <Button onClick={handleDeletePopupCancel} sx={{color:'#fff', fontSize:'12px', background:'#6193cc', padding:'2px 10px'}}>Cancel</Button>
                <Button onClick={handleDelete} sx={{color:'#fff', fontSize:'12px', background:'#f02323', padding:'2px 10px'}}>Yes, Delete</Button>
            </DialogActions>
        </Dialog>

    </>
    )
 
}

export default TaskList;