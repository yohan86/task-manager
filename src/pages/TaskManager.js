import { useEffect, useState } from 'react';
import { Alert, Snackbar, Box, TextField, Button, Grid2 } from '@mui/material';
import TaskList from './../components/TaskList';

const TaskManager = () => {
    const [task, setTask] = useState('');
    const [taskList, setTaskList] = useState({});


    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks')
        if(savedTasks){
            setTaskList(JSON.parse(savedTasks));
        }
    }, [])

    useEffect(() => {
        if(Object.keys(taskList).length > 0 ) {
            localStorage.setItem('tasks', JSON.stringify(taskList));
        }
    }, [taskList])

    const addTasks = () => {
        if (task.trim()) {
            const newIndex = Date.now();
        
            setTaskList((prev)=>{
                const updatedTaskList = { ...prev, [newIndex]:{ name:task, priority:'Low' }, }
                return updatedTaskList;
            })

            setTask('');
        }
    }
    const handleDeleteTask = (deleteItem) => {
        //setTaskList(taskList.filter(task => task !== deleteItem));

        setTaskList((prev)=>{
            const deletearr = {...prev};
            delete deletearr[deleteItem];
            return deletearr;
        })
    }

    const handleUpdateTask = (editItem, task, updatedPriority) => {
        setTaskList((prev)=>({
            ...prev,
            [editItem]: { name: task, priority: updatedPriority },
        }));
    }

    return (
        <>
            <Grid2 container sx={{ maxWidth: 600, margin: '25px auto' }} alignItems='center' spacing={2}>
                <Grid2 size={9}><TextField
                    label='Task Name'
                    fullWidth
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className='form_field'

                ></TextField>
                </Grid2>
                <Grid2 size={3}><Button
                    variant='contained'
                    color='primary'
                    sx={{ height: 46, width: '100%' }}
                    onClick={addTasks}
                >Add Task
                </Button>
                </Grid2>
            </Grid2>
     
            <Box sx={{ width: 600, margin: '0 auto' }}>
                {Object.keys(taskList).length > 0 && <Box>Active Tasks:{Object.keys(taskList).length }</Box>}
                {taskList && Object.keys(taskList).length > 0 ?
                    <TaskList taskList={taskList} onDelete={handleDeleteTask} onEdit={handleUpdateTask}  />
                    : <Alert severity="info">
                        No Task Added So far
                    </Alert>
                }
            </Box>

        </>
    )
}

export default TaskManager;