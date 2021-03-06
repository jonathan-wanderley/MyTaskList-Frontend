const url = 'https://mytasklist-app.herokuapp.com/todo';


var newTaskDoneOption = 'false';
document.querySelector('.new-taskBox .new-taskItem i').addEventListener('click', ()=>{
    if(newTaskDoneOption == 'true') {
        newTaskDoneOption = 'false';
        document.querySelector('.new-taskBox .new-taskItem i').classList.remove('fa-check-square-o');
        document.querySelector('.new-taskBox .new-taskItem i').classList.add('fa-square-o');
    } else {
        newTaskDoneOption = 'true';
        document.querySelector('.new-taskBox .new-taskItem i').classList.add('fa-check-square-o');
        document.querySelector('.new-taskBox .new-taskItem i').classList.remove('fa-square-o');
    }
})


//PEGAR E EXIBIR DATA
function getDate() {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    document.querySelector('.date-day').innerHTML = day;
    document.querySelector('.date-month').innerHTML = months[month];
}
getDate();

//LISTAS TASKS + FUNÇOES IMPLEMENTADAS
async function getTasksFromApi() {   
    let requisicao = await fetch(url, { method: 'GET' })
    let json = await requisicao.json();
    let lista = json.list

    let tasksNormal = lista.filter((item) => item.done == false);
    let tasksDone = lista.filter((item) => item.done == true);

    listarTasks(tasksNormal, 'normal');
    listarTasks(tasksDone, 'completed');

    const loaders = document.querySelectorAll('.lds-ring');
    loaders.forEach((loader) => {
        loader.style.display = 'none'
    })

    const taskLists = document.querySelectorAll('.task-list');
    taskLists.forEach((taskListItem) => {
        taskListItem.classList.remove('none');
    })
}
function listarTasks(lista, tipo) {
    lista.forEach(item => {
        let taskItem = document.querySelector('.models .task-item').cloneNode(true); 
        taskItem.querySelector('.task-text').innerHTML = item.title;
        
        //CHECKS
        taskChecks(item, tipo, taskItem);
        
        //EDIT
        taskItem.querySelector('.editTask').addEventListener('click', () => {
            document.querySelector('.edit-taskBox').style.display = 'flex';
            document.querySelector('.edit-taskItem input').value = item.title;
            document.querySelector('.edit-taskBox .edit-taskSubmit').setAttribute("onClick",`editTask(${item.id})`);

            editCheckDone(item);

            let buttonCheck = document.querySelector('.edit-taskItem i')
            buttonCheck.addEventListener('click', () => {
                if(buttonCheck.classList.contains('fa-check-square-o')) {
                    buttonCheck.classList.remove('fa-check-square-o')
                    buttonCheck.classList.add('fa-square-o')
                } else {
                    buttonCheck.classList.add('fa-check-square-o')
                    buttonCheck.classList.remove('fa-square-o')
                }
            })


            // document.querySelector('.edit-taskSubmit').onclick = editTask();
        })

        //Excluir Task
        taskItem.querySelector('.removeTask').addEventListener('click', async () => {
            await fetch(`${url}/${item.id}`, { method: 'DELETE' });
            location.reload();
        })
        

        //Adicionar a lista
        document.querySelector(`.my-tasks.${tipo} .task-list`).append( taskItem );
    });
}
function taskChecks(item, tipo, taskItem) {
    switch (tipo) {
        case 'normal':
            taskItem.querySelector('.checkTask').classList.add('fa-square-o');
            taskItem.querySelector('.checkTask').classList.remove('fa-check-square-o');
            taskItem.querySelector('.checkTask').addEventListener('click', async () => {
                await fetch(`${url}/${item.id}`, {
                    method: 'PUT',
                    body: "done=true",
                    headers: 
                    {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
                .then((data)=>{
                    location.reload();
                })
                .catch((error)=> console.log(error))
            })
            break;
        case 'completed':
            taskItem.querySelector('.checkTask').classList.remove('fa-square-o');
            taskItem.querySelector('.checkTask').classList.add('fa-check-square-o');
            taskItem.querySelector('.checkTask').addEventListener('click', async () => {
                await fetch(`${url}/${item.id}`, {
                    method: 'PUT',
                    body: "done=false",
                    headers: 
                    {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
                .then((data)=>{
                    location.reload();
                })
                .catch((error)=> console.log(error))
            })
            break;
    }
}
getTasksFromApi();

function openNewTaskPainel() {
    document.querySelector('.new-taskBox').style.display = 'flex';
}

function closeNewTaskPainel() {
    document.querySelector('.new-taskBox .new-taskItem input').value = '';
    newTaskDoneOption = 'false';
    document.querySelector('.new-taskBox .new-taskItem i').classList.remove('fa-check-square-o');
    document.querySelector('.new-taskBox .new-taskItem i').classList.add('fa-square-o');
    document.querySelector('.new-taskBox').style.display = 'none';
}

function closeEditTaskPainel() {
    document.querySelector('.edit-taskBox .edit-taskSubmit').setAttribute("onClick",`editTask()`);
    document.querySelector('.edit-taskBox').style.display = 'none';
}

async function addTask() {
    const title = document.querySelector('.new-taskBox .new-taskItem input').value
    
    await fetch(url, {
        method: 'POST',
        body: `title=${title}&done=${newTaskDoneOption}`,
        headers: 
        {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    document.querySelector('.new-taskBox .new-taskItem input').value = '';
    document.querySelector('.new-taskBox').style.display = 'none';
    location.reload();
}

function editCheckDone(item) {
    if(item.done){
        document.querySelector('.edit-taskItem i').classList.remove('fa-square-o');
        document.querySelector('.edit-taskItem i').classList.add('fa-check-square-o');
    } else {
        document.querySelector('.edit-taskItem i').classList.add('fa-square-o');
        document.querySelector('.edit-taskItem i').classList.remove('fa-check-square-o');
    }
    
}

async function editTask(itemId) {
    const editTitle = document.querySelector('.edit-taskItem input').value;
    const editDone = document.querySelector('.edit-taskItem i').classList.contains('fa-check-square-o');
    
    await fetch(`${url}/${itemId}`, {
        method: 'PUT',
        body: `title=${editTitle}&done=${editDone}`,
        headers: 
        {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    location.reload();
}