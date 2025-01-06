import { useState } from 'react';
import { Alert, Snackbar, Box, TextField, Button, Grid2 } from '@mui/material';
import TaskList from './../components/TaskList';

const TaskManager = () => {
    const [task, setTask] = useState('');
    const [taskList, setTaskList] = useState([]);

    const addTasks = () => {
        if (task.trim()) {
            setTaskList([...taskList, task]);
            setTask('');
        }
    }
    const handleDeleteTask = (deleteItem) => {
        setTaskList(taskList.filter(task => task !== deleteItem));
    }

    const handleUpdateTask = (editItem, task) => {
        let tempTaskarr = [...taskList];
        let findIndex = tempTaskarr.indexOf(editItem);
        tempTaskarr[editItem] = task;
        setTaskList(tempTaskarr);
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
                {taskList && taskList.length > 0 ?
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