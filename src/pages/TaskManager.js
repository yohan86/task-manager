import { useEffect, useState, useRef } from 'react';
import { Alert, Snackbar, Box, TextField, Button, Grid2 , Typography } from '@mui/material';
import TaskList from './../components/TaskList';
import { FilterTiltShift } from '@mui/icons-material';
import CompletedTaskList from './../components/CompletedTaskList';


const migrateTasksV1ToV2= (migTaskList) => {
    return Object.keys(migTaskList).reduce((list, key) => {
        const listItem = migTaskList[key];
        if(!listItem.dueDate){
            listItem.dueDate = null;
        }
        list[key] = listItem;
        return list;
    },{});
}

const TaskManager = () => {
    const [task, setTask] = useState('');
    const localStorageDebounce = useRef(null);
    const [taskList, setTaskList] = useState({});

//for only migration
    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        const savedVersion = localStorage.getItem('taskVersion') || '1';

        if(savedTasks){
            let savedTaskList = JSON.parse(savedTasks);
            if(savedVersion === '1'){
                savedTaskList = migrateTasksV1ToV2(savedTaskList);
                localStorage.setItem('tasks', JSON.stringify(savedTaskList));
                localStorage.setItem('taskVersion', '2');
            }
            setTaskList(savedTaskList);
        }
    }, [])

    useEffect(() => {
        if(localStorageDebounce.current){
            clearTimeout(localStorageDebounce.current);
        }
        if(Object.keys(taskList).length > 0 ) {
            localStorageDebounce.current = setTimeout(() => {
                localStorage.setItem('tasks', JSON.stringify(taskList));
            }, 300);
        }
    }, [taskList])

    const addTasks = () => {
        if (task.trim()) {
            const newIndex = Date.now();
        
            setTaskList((prev)=>{
                const updatedTaskList = { ...prev, [newIndex]:{ name:task, priority:'Low', status:'active', dueDate:null }, }
                return updatedTaskList;
            })

            setTask('');
        }
    }
    
    const filterCompletedItems = () => {
        return Object.keys(taskList).reduce((items, key) => {
            if(taskList[key].status === 'completed'){
                items[key] = taskList[key];
            }
            return items;
        }, {});

    }

    console.log(filterCompletedItems())

    const filterActiveItems = () => {
        return Object.keys(taskList).reduce((items, key) => {
            if(taskList[key].status !== 'completed'){
                items[key] = taskList[key];
            }
            return items;
        }, {});
    }
    
    const handleDeleteTask = (deleteItem) => {
        //setTaskList(taskList.filter(task => task !== deleteItem));

        setTaskList((prev)=>{
            const deletearr = {...prev};
            delete deletearr[deleteItem];
            localStorage.setItem('tasks', JSON.stringify(deletearr));
            return deletearr;
        })
    }

    const handleUpdateTask = (editItem, task, updatedPriority, status) => {
        setTaskList((prev)=>({
            ...prev,
            [editItem]: { name: task, priority: updatedPriority, status:status },
        }));
    }


    //update array when completed the task
    const handleCompleted = (index)=> {
        const changeStatus = {...taskList[index], status:'completed'};
        setTaskList((prev) => ({
            ...prev,
            [index]:changeStatus,
        }))
        
    }

    const deleteCompletedItem = (index) => {
        setTaskList((prev) => {
            const tasks = {...prev};
            delete tasks[index];
            return tasks;

        })
    }
    const deleteuser = () => {

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
                {Object.keys(filterActiveItems()).length > 0 && <Box>Active Tasks:{Object.keys(filterActiveItems()).length }</Box>}
                {taskList && Object.keys(filterActiveItems()).length > 0 ?
                    <TaskList taskList={filterActiveItems()} onDelete={handleDeleteTask} onEdit={handleUpdateTask} onCompleted={handleCompleted}  />
                    : <Alert severity="info">
                        No Active Tasks 
                    </Alert>
                }
            </Box>
            <Box sx={{ width: 600, margin: '0 auto' }}>
                <Box component="h2" sx={{color:'#476689', borderBottom:'2px solid #476689', paddingBlock:2}}>Completed Tasks</Box>
                <CompletedTaskList taskList={filterCompletedItems()} onDelete={deleteCompletedItem} />
            </Box>
            <Box>
                <button onClick={deleteuser}>Log out</button>
            </Box>

        </>
    )
}

export default TaskManager;