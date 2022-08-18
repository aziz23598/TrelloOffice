$(document).ready(() => {
    let table = $('#tableProject').DataTable({
        "language": {
            "paginate": {
                "previous": "<i class='ni ni-bold-left'></i>",
                "next": "<i class='ni ni-bold-right'></i>"
            }
        },
        columnDefs: [{
                orderable: false,
                targets: -1
            },
            {
                className: 'text-center',
                targets: [0, 1, 2, 3]
            }
        ],
        "ajax": {
            "url": "https://localhost:44335/Project/GetJSON",
            "dataType": "json",
        },
        "columns": [{
                "data": "ProjectId",
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                "data": "Name"
            },
            {
                "data": "Description"
            },
            {
                // data: null,
                render: function (data, type, row) {

                    return `
                                <button type="button" onclick="detailProject(${row['ProjectId']})" data-toggle="modal" data-target="#detailProject" class="btn btn-success">
                                    Details
                                </button>
                                <button type="button" onclick="editProject(${row['ProjectId']})" data-toggle="modal" data-target="#editProject" class="btn btn-warning">
                                    Edit
                                </button>
                                <button type="button" onclick="deleteProject(${row['ProjectId']})" class="btn btn-danger">
                                    Delete
                                </button>`
                }
            }
        ],
    })
})

function addProject() {
    let createModalBody =
        `
        <div class="form" id="form-post">
            <div class="col mb-3">
                <label for="projectName" class="form-control-label">Project Name</label>
                <input asp-for="Name" name="projectName" type="text" class="form-control form-control-alternative"
                    id="projectName" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    Please Input Valid Project Name!
                </div>
            </div>
            <div class="col mb-3">
                <label for="Description" class="form-control-label">Description</label>
                <textarea class="form-control" id="description" aria-label="Description" required></textarea>
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    Please Input Valid Description!
                </div>
            </div>
        </div>               
        `;
    $("#modalCreate").html(createModalBody);
    let forms = document.getElementsByClassName("needs-validation");

    let validation = Array.prototype.filter.call(forms, (form) => {
        form.addEventListener('submit', (event) => {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                let obj = {};
                obj.name = $("#projectName").val();
                obj.description = $("#description").val();
                swal({
                    title: "Are you sure?",
                    text: `You will add Project : ${obj.name}`,
                    buttons: {
                        cancel: true,
                        confirm: true,
                        closeModal: false
                    },
                }).then((isConfirm) => {
                    if (isConfirm === true) {
                        $.ajax({
                            url: "https://localhost:44335/project/postjson",
                            type: "post",
                            dataType: "json",
                            data: obj,
                            beforeSend: data => {
                                data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
                            },
                            success: () => {
                                $("#tableProject").DataTable().ajax.reload();
                                $("#addProject").modal('hide'),
                                    swal(
                                        "Success",
                                        `${obj.name} has been saved`,
                                        "success"
                                    )
                            },
                            failure: () => {
                                swal(
                                    "Internal Server Error",
                                    `Oops, ${obj.name} was not saved`,
                                    "error"
                                )
                            }
                        })
                    }
                })
            }
            form.classList.add('was-validated');
        }, false);
    })
}

function editProject(id) {
    $.ajax({
        url: `https://localhost:44335/project/getjsonbyid/${id}`,
        type: 'get'
    }).done((result) => {
        let editModalBody =
            `
        <div class="form">
            <input name="projectId" type="number" class="form-control form-control-alternative"
                id="projectId" value=${result.data.ProjectId} hidden required>
            <div class="col mb-3">
                <label for="name" class="form-control-label">Project Name</label>
                <input id="name" type="text" class="form-control form-control-alternative"
                         value="${result.data['Name']}" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="col mb-3">
                <label for="description" class="form-control-label">Description</label>
                <textarea class="form-control" id="description" aria-label="description" required>${result.data['Description']}</textarea>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
        </div>
        `;
        $("#modalEdit").html(editModalBody);
        var formsEdit = document.getElementsByClassName('edit-validation');
        // Loop over them and prevent submission
        var validationEdit = Array.prototype.filter.call(formsEdit, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.preventDefault();
                    let obj = {};
                    obj.ProjectId = $("#projectId").val();
                    obj.Name = $("#name").val();
                    obj.Description = $("#description").val();
                    swal({
                        title: "Are you sure?",
                        text: `You will edit ${obj.Name}`,
                        buttons: {
                            cancel: true,
                            confirm: true,
                            closeModal: false
                        },
                    }).then(function (isConfirm) {
                        if (isConfirm === true) {
                            $.ajax({
                                url: "https://localhost:44335/project/editjson",
                                type: "put",
                                dataType: "json",
                                data: obj,
                                beforeSend: data => {
                                    data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
                                },
                                success: function (data) {
                                    $("#tableProject").DataTable().ajax.reload();
                                    $("#editProject").modal('hide'),
                                        swal(
                                            "Success!",
                                            `${obj.Name} has been edited`,
                                            "success"
                                        )
                                },
                                failure: function (data) {
                                    swal(
                                        "Internal Error",
                                        "Oops, Product was not saved.",
                                        "error"
                                    )
                                }
                            });
                        }
                    })
                }
                form.classList.add('was-validated');
            }, false);
        });
    })
}

function deleteProject(id) {
    $.ajax({
        url: `https://localhost:44335/project/getjsonbyid/${id}`,
        type: 'get'
    }).done((result) => {
        let obj = {};
        obj.ProjectId = result.data.ProjectId;
        obj.Name = result.data.Name;
        obj.Description = result.data.Description;
        swal({
            title: "Are you sure?",
            text: `You will delete ${obj.Name}`,
            buttons: {
                cancel: true,
                confirm: true,
                closeModal: false
            },
        }).then(function (isConfirm) {
            if (isConfirm === true) {
                $.ajax({
                    url: "https://localhost:44335/project/deletejson",
                    type: "delete",
                    dataType: "json",
                    data: obj,
                    beforeSend: data => {
                        data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
                    },
                    success: function (data) {
                        $("#tableProject").DataTable().ajax.reload();
                        swal(
                            "Success!",
                            `${obj.Name} has been deleted !`,
                            "success"
                        )
                    },
                    failure: function (data) {
                        swal(
                            "Internal Error",
                            "Oops, Product was not saved.",
                            "error"
                        )
                    }
                });
            }
        })
    })
}

function detailProject(id) {
    $.ajax({
        url: `https://localhost:44335/project/getjsonbyid/${id}`,
        type: 'get'
    }).done((result) => {
        const category = {};
        let detailModalBody =
            `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title"><i class='ni ni-bag-17'></i> Project Name</h2>
                    ${result.data.Name}
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title"><i class='ni ni-align-left-2'></i> Description</h2>
                    ${result.data.Description}
                </div>
            </div>
            <div class="form" id="form-post">
                <div class="card">
                    <div class="card-body">
                        <h2 class="card-title"><i class='ni ni-check-bold'></i> Checklist Task</h2>
                        <div class="col mb-3" id="taskList">
                        </div>
                        <div class="col mb-3" id="addTaskSection">
                        </div>
                    </div>
                </div>
                
            </div>               
        `;
        $("#modalDetail").html(detailModalBody);
        $.ajax({
            url: `https://localhost:44335/task/getjson`,
            type: 'get'
        }).done((result) => {
            let projectId = [];
            let hashTaskProject = {};
            let hashTaskDoneProject = {};
            const totalResult = result.data;
            for (let i = 0; i < result.data.length; i++) {
                if (projectId.includes(result.data[i].ProjectId)) {
                    continue;
                } else {
                    projectId.push(result.data[i].ProjectId);
                }
            }
            for (let i = 0; i < projectId.length; i++) {
                hashTaskProject[projectId[i]] = 0;
                hashTaskDoneProject[projectId[i]] = 0;
            }
            for (let i = 0; i < result.data.length; i++) {
                if (result.data[i].IsCompleted == true) {
                    for (let y = 0; y < projectId.length; y++) {
                        if (Object.keys(hashTaskDoneProject)[y] == result.data[i].ProjectId) {
                            hashTaskDoneProject[Object.keys(hashTaskDoneProject)[y]] += 1;
                        }
                    }
                }
                for (let y = 0; y < projectId.length; y++) {
                    if (Object.keys(hashTaskProject)[y] == result.data[i].ProjectId) {
                        hashTaskProject[Object.keys(hashTaskProject)[y]] += 1;
                    }
                }
            }
            let task =
                `
                    <div class="progress-wrapper">
                        <div class="progress-info">
                            <div class="progress-label">
                            <span>Task completed</span>
                            </div>
                            <div class="progress-percentage" id="progressPercent">
                            
                            </div>
                        </div>
                        <div class="progress" id="progressBar">
                            
                        </div>
                        </div>
                        <ul class="list-group">
                            <div class="row">
                                <div class="col" id="listGroup">
            `;
            $("#taskList").html(task);
            let progressPercent = "";
            let progressBar = "";
            for (let i = 0; i < result.data.length; i++) {

                if (projectId[i] == id) {
                    progressPercent +=
                        `
                    <span>${Math.floor((Object.values(hashTaskDoneProject)[i] / Object.values(hashTaskProject)[i])*100)}%</span>
                    `
                    progressBar +=
                        `
                    <div class="progress-bar bg-success" role="progressbar" aria-valuenow="${Math.floor((Object.values(hashTaskDoneProject)[i] / Object.values(hashTaskProject)[i])*100)}" aria-valuemin="0" aria-valuemax="100" style="width: ${Math.floor((Object.values(hashTaskDoneProject)[i] / Object.values(hashTaskProject)[i])*100)}%;"></div>
                    `
                }
            }
            $("#progressPercent").html(progressPercent);
            $("#progressBar").html(progressBar);
            let taskList = "";
            console.log(result.data[0].category.Name);
            let categoryId = [];
            for (let i = 0; i < result.data.length; i++) {
                if (result.data[i].ProjectId == id) {
                    if (result.data[i].IsCompleted == true) {
                        taskList +=
                            `
                        <li class="list-group-item">
                            <div class="d-flex custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="checkbox${i}" checked>
                                <label class="custom-control-label" for="checkbox${i}"><s>${result.data[i].Name}</s></label>
                                <div class="ml-auto">
                                    <span class="badge badge-pill badge-success">${result.data[i].DueDate}</span>
                                    <button class="btn btn-success btn-sm" onclick="assignTask(${result.data[i].TaskId})" type="button" data-toggle="collapse" data-target="#collapseAssign${i}" aria-expanded="false" aria-controls="collapseAssign${i}">
                                        Assign Task
                                    </button>
                                    <button class="btn btn-warning btn-sm" type="button" data-toggle="collapse" data-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample${i}">
                                        Edit Task
                                    </button>
                                    <button class="btn btn-icon btn-danger btn-sm" type="button" onclick="deleteTask(${result.data[i].TaskId})">
	                                    <span class="btn-inner--icon"><i class="ni ni-fat-remove"></i></span>
                                    </button>
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="collapse" id="collapseExample${i}">
                                    <div class="card card-body">
                                    <div class="form" id="form-post">
                                    <input name="taskId" type="number" class="form-control form-control-alternative"
                                            id="taskId${i}" value="${result.data[i].TaskId}" hidden required>
                                    <div class="col mb-3">
                                        <label class="form-control-label" for="taskName">Task Name</label>
                                        <input name="taskName" type="text" class="form-control form-control-alternative"
                                            id="taskName${i}" value="${result.data[i].Name}" required>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div class="invalid-feedback">
                                            Please Input Valid Project Name!
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <label class="form-control-label" for="taskDescription">Task Description</label>
                                        <textarea class="form-control" id="taskDescription${i}" aria-label="taskDescription" required>${result.data[i].Description}</textarea>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div class="invalid-feedback">
                                            Please Input Valid Project Name!
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <label class="form-control-label" for="CategoryId${i}">Category</label>
                                        <select class="form-control" id="CategoryId${i}" required>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please select a valid supplier.
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <label class="form-control-label" for="dueDateInput">Due Date</label>
                                        <input class="form-control form-control-alternative" name="dueDateInput" placeholder="Select date" type="date" 
                                            id="dueDateInput${i}" value="${result.data[i].DueDate}" required>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div class="invalid-feedback">
                                            Please Input Valid Description!
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <button type="button" id="editTaskBtn${i}" class="btn btn-warning">Edit Task</button>
                                    </div>
                                </div>          
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="collapse" id="collapseAssign${i}">
                                
                                </div>
                            </div> 
                        </li>
                        `
                        
                    }
                    if (result.data[i].IsCompleted == false) {
                        taskList +=
                            `
                        <li class="list-group-item">
                            <div class="d-flex custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="checkbox${i}">
                                <label class="custom-control-label" for="checkbox${i}">${result.data[i].Name}</label>
                                <div class="ml-auto">
                                    <span class="badge badge-pill badge-danger">${result.data[i].DueDate}</span>
                                    <button class="btn btn-success btn-sm" onclick="assignTask(${result.data[i].TaskId})" type="button" data-toggle="collapse" data-target="#collapseAssign${i}" aria-expanded="false" aria-controls="collapseAssign${i}">
                                        Assign Task
                                    </button>
                                    <button class="btn btn-warning btn-sm" type="button" data-toggle="collapse" data-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample${i}">
                                        Edit Task
                                    </button>
                                    <button class="btn btn-icon btn-danger btn-sm" type="button" onclick="deleteTask(${result.data[i].TaskId})">
	                                    <span class="btn-inner--icon"><i class="ni ni-fat-remove"></i></span>
                                    </button>
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="collapse" id="collapseExample${i}">
                                    <div class="card card-body">
                                    <div class="form" id="form-post">
                                    <input name="taskId" type="number" class="form-control form-control-alternative"
                                            id="taskId${i}" value="${result.data[i].TaskId}" hidden required>
                                    <div class="col mb-3">
                                        <label class="form-control-label" for="taskName">Task Name</label>
                                        <input name="taskName" type="text" class="form-control form-control-alternative"
                                            id="taskName${i}" value="${result.data[i].Name}" required>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div class="invalid-feedback">
                                            Please Input Valid Project Name!
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <label class="form-control-label" for="taskDescription">Task Description</label>
                                        <textarea class="form-control" id="taskDescription${i}" aria-label="taskDescription" required>${result.data[i].Description}</textarea>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div class="invalid-feedback">
                                            Please Input Valid Project Name!
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <label class="form-control-label" for="CategoryId${i}">Category</label>
                                        <select class="form-control" id="CategoryId${i}" required>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please select a valid supplier.
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <label class="form-control-label" for="dueDateInput">Due Date</label>
                                        <input class="form-control form-control-alternative" name="dueDateInput" placeholder="Select date" type="date" 
                                            id="dueDateInput${i}" value="${result.data[i].DueDate}" required>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div class="invalid-feedback">
                                            Please Input Valid Description!
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <button type="button" id="editTaskBtn${i}" class="btn btn-warning">Edit Task</button>
                                    </div>
                                </div>          
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="collapse" id="collapseAssign${i}">
                                
                                </div>
                            </div> 
                        </li>
                        `
                    }   
                }
                    
            }
            
            for (let i = 0; i < result.data.length; i++) {
                $.ajax({
                    url: `https://localhost:44335/category/getjson`,
                    type: 'get'
                }).done((result) => {
                    let option = "";
                    option +=
                    `
                    <option selected value=${totalResult[i].category.CategoryId}>${totalResult[i].category.Name}</option>
                    `
                    $.each(result.data, (key, val) => {
                        if (val.CategoryId != totalResult[i].category.CategoryId) {
                            option +=
                            `
                            <option value=${val.CategoryId}>${val.Name}</option>
                            `;
                        }
                    })
                    $(`#CategoryId${i}`).html(option);
                })
            }

            

            taskList +=
                `
                    </div>
                </div>
            </ul>   
            `
            $("#listGroup").html(taskList);
            for (let i = 0; i < result.data.length; i++) {
                $(`#editTaskBtn${i}`).on('click', () => {
                    let obj = {};
                    optionName = document.getElementById(`CategoryId${i}`);
                    let categoryValue = optionName.options[optionName.selectedIndex].value;
                    obj.TaskId = parseInt($(`#taskId${i}`).val());
                    obj.ProjectId = result.data[id].ProjectId;
                    obj.CategoryId = categoryValue;
                    obj.Name = $(`#taskName${i}`).val();
                    obj.Description = $(`#taskDescription${i}`).val();
                    let dueDates = new Date($(`#dueDateInput${i}`).val());
                    dueDates = dueDates.toISOString().slice(0, 10).replace('T', ' ');
                    obj.DueDate = dueDates;
                    obj.IsCompleted = false;
                    console.log(obj);
                    $.ajax({
                        url: "https://localhost:44335/task/editjson",
                        type: "put",
                        dataType: "json",
                        data: obj,
                        beforeSend: data => {
                            data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
                        },
                        success: function (data) {
                            $("#tableProject").DataTable().ajax.reload();
                            $("#detailProject").modal('hide');
                            swal({
                                title: "Success!",
                                text: `${obj.Name} has been edited !`,
                                timer: 1000
                            });
                        },
                        failure: function (data) {
                            swal(
                                "Internal Error",
                                "Oops, Product was not saved.",
                                "error"
                            )
                        }
                    });
                })
            }

            for (let i = 0; i < result.data.length; i++) {

                $(function () {
                    $(`#checkbox${i}`).on('change', function (e) {

                        if ($(this).is(':checked')) {
                            let check = true;
                            let obj = {};
                            obj.TaskId = result.data[i].TaskId;
                            obj.ProjectId = result.data[i].ProjectId;
                            obj.CategoryId = result.data[i].CategoryId;
                            obj.Name = result.data[i].Name;
                            obj.Description = result.data[i].Description;
                            obj.DueDate = result.data[i].DueDate;
                            obj.IsCompleted = check;
                            $.ajax({
                                url: "https://localhost:44335/task/editjson",
                                type: "put",
                                dataType: "json",
                                data: obj,
                                beforeSend: data => {
                                    data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
                                },
                                success: function (data) {
                                    $("#tableProject").DataTable().ajax.reload();
                                    $("#detailProject").modal('hide'),
                                        swal(
                                            "Success!",
                                            `${obj.Name} is done !`,
                                            "success"
                                        )
                                },
                                failure: function (data) {
                                    swal(
                                        "Internal Error",
                                        "Oops, Product was not saved.",
                                        "error"
                                    )
                                }
                            });
                        } else {
                            let check = false;
                            let obj = {};
                            obj.TaskId = result.data[i].TaskId;
                            obj.ProjectId = result.data[i].ProjectId;
                            obj.CategoryId = result.data[i].CategoryId;
                            obj.Name = result.data[i].Name;
                            obj.Description = result.data[i].Description;
                            obj.DueDate = result.data[i].DueDate;
                            obj.IsCompleted = check;
                            $.ajax({
                                url: "https://localhost:44335/task/editjson",
                                type: "put",
                                dataType: "json",
                                data: obj,
                                beforeSend: data => {
                                    data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
                                },
                                success: function (data) {
                                    $("#tableProject").DataTable().ajax.reload();
                                    $("#detailProject").modal('hide');
                                    swal({
                                        title: "Success!",
                                        text: `${obj.Name} is not done yet !`,
                                        timer: 1000
                                    })
                                },
                                failure: function (data) {
                                    swal(
                                        "Internal Error",
                                        "Oops, Product was not saved.",
                                        "error"
                                    )
                                }
                            });
                        }
                    });
                });

            }

            let addTaskSection =
                `
            <button class='btn btn-primary' type="button" data-toggle="collapse" data-target="#collapseAddTask" aria-expanded="false" aria-controls="collapseAddTask"><i class='ni ni-fat-add'></i>Add Task</button>
            <div class="mt-3">
            <div class="collapse" id="collapseAddTask">
            <div class="card card-body">
                <div class="form" id="form-post">
                    <div class="col mb-3">
                        <label class="form-control-label" for="taskAddName">Task Name</label>
                        <input name="taskAddName" type="text" class="form-control form-control-alternative"
                            id="taskAddName" required>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                        <div class="invalid-feedback">
                            Please Input Valid Project Name!
                        </div>
                    </div>
                    <div class="col mb-3">
                        <label class="form-control-label" for="taskAddDescription">Task Description</label>
                        <textarea class="form-control" id="taskAddDescription" aria-label="taskAddDescription" required></textarea>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                        <div class="invalid-feedback">
                            Please Input Valid Project Name!
                        </div>
                    </div>
                    <div class="col mb-3">
                        <label class="form-control-label" for="CategoryId">Category</label>
                            <select class="form-control" id="CategoryId" required>
                            </select>
                        <div class="invalid-feedback">
                            Please select a valid supplier.
                        </div>
                    </div>
                    <div class="col mb-3">
                        <label class="form-control-label" for="dueDateAddInput">Due Date</label>
                        <input class="form-control form-control-alternative" name="dueDateAddInput" placeholder="Select date" type="date" id="dueDateAddInput" required>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                        <div class="invalid-feedback">
                            Please Input Valid Description!
                        </div>
                    </div>
                    <div class="col mb-3">
                    <button type="button" class="btn btn-primary" onclick="addTask(${id})">Submit Task</button>
                    </div>
                
                </div>          
            </div>
        </div>
            </div>
            
            
            `;
            $("#addTaskSection").html(addTaskSection);
            $.ajax({
                url: `https://localhost:44335/category/getjson`,
                type: 'get'
            }).done((result) => {
                let option = "";
                option +=
                    `
                    <option selected disabled value="">Choose Category..</option>
                    `
                $.each(result.data, (key, val) => {
                    option +=
                        `
                    <option value=${val.CategoryId}>${val.Name}</option>
                    `;
                })
                $("#CategoryId").html(option);
            })
            
        })
    });
}

function addTask(id) {
    $.ajax({
        url: `https://localhost:44335/project/getjsonbyid/${id}`,
        type: 'get'
    }).done((result) => {
        optionName = document.getElementById(`CategoryId`);
        let categoryValue = optionName.options[optionName.selectedIndex].value;
        let obj = {};
        obj.ProjectId = result.data.ProjectId;
        obj.CategoryId = categoryValue;
        obj.Name = $("#taskAddName").val();
        obj.Description = $("#taskAddDescription").val();
        let dueDates = new Date($('#dueDateAddInput').val());
        dueDates = dueDates.toISOString().slice(0, 10).replace('T', ' ');
        obj.DueDate = dueDates;
        obj.IsCompleted = false;
        $.ajax({
            url: "https://localhost:44335/task/postjson",
            type: "post",
            dataType: "json",
            data: obj,
            beforeSend: data => {
                data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
            },
            success: function (data) {
                $("#tableProject").DataTable().ajax.reload();
                $("#detailProject").modal('hide');
                swal({
                    title: "Success!",
                    text: `${obj.Name} has been added !`,
                    timer: 1000
                });
            },
            failure: function (data) {
                swal(
                    "Internal Error",
                    "Oops, Product was not saved.",
                    "error"
                )
            }
        });
    })
}

function deleteTask(id) {
    $.ajax({
        url: `https://localhost:44335/task/getjsonbyid/${id}`,
        type: 'get'
    }).done((result) => {
        let obj = {};
        obj.TaskId = result.data.TaskId;
        obj.ProjectId = result.data.ProjectId;
        obj.CategoryId = result.data.CategoryId;
        obj.Name = result.data.Name;
        obj.Description = result.data.Description;
        obj.DueDate = result.data.DueDate;
        obj.IsCompleted = result.data.IsCompleted;
        swal({
            title: "Are you sure?",
            text: `You will delete Task : ${obj.Name}`,
            buttons: {
                cancel: true,
                confirm: true,
                closeModal: false
            },
        }).then(function (isConfirm) {
            if (isConfirm === true) {
                $.ajax({
                    url: "https://localhost:44335/task/deletejson",
                    type: "delete",
                    dataType: "json",
                    data: obj,
                    beforeSend: data => {
                        data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
                    },
                    success: function (data) {
                        $("#tableProject").DataTable().ajax.reload();
                        $("#detailProject").modal('hide');
                        swal(
                            "Success!",
                            `${obj.Name} has been deleted !`,
                            "success"
                        )
                    },
                    failure: function (data) {
                        swal(
                            "Internal Error",
                            "Oops, Product was not saved.",
                            "error"
                        )
                    }
                });
            }
        })
    })
}

function assignTask(id) {
    $.ajax({
        url: `https://localhost:44335/task/getjson`,
        type: 'get'
    }).done((result) => {
        const dataOption = result.data.length;
        const user = {};
        const optionName = {};
        for (let i = 0; i < dataOption; i++) {
            let assignTask =
                `
        <div class="card card-body">
            <div class="form" id="form-post">
                <input value="${id}" hidden/>
                <div class="col mb-3">
                    <label class="form-control-label" for="UserId">Email | Username</label>
                    <select class="form-control" id="UserId${i}" required>
                    </select>
                    <div class="invalid-feedback">
                        Please select a valid supplier.
                    </div>
                </div>
                <div class="col mb-3">
                    <button type="button" class="btn btn-success" id="assignTaskBtn${i}">Assign Task</button>
                </div>
            </div>
        </div>
        `
            $(`#collapseAssign${i}`).html(assignTask);
        }

        for (let i = 0; i < dataOption; i++) {
            $.ajax({
                url: `https://localhost:44335/user/getjson`,
                type: 'get'
            }).done((result) => {

                let option = "";
                option +=
                    `
                <option selected disabled value="">Choose User or Employee..</option>
                `
                $.each(result.data, (key, val) => {
                    option +=
                        `
                    <option value=${val.UserId}>${val.Email} | ${val.Username}</option>
                    `;
                    user[val.Email] = val.UserId;
                })
                $(`#UserId${i}`).html(option);
            })
        }
        $.ajax({
            url: `https://localhost:44335/task/getjson`,
            type: 'get'
        }).done((result) => {
            for (let i = 0; i < result.data.length; i++) {
                optionName[i] = document.getElementById(`UserId${i}`);
            }
            for (let i = 0; i < result.data.length; i++) {
                $(`#assignTaskBtn${i}`).on('click', () => {
                    let options = Object.values(optionName)[i];
                    let value = options.options[options.selectedIndex].value;

                    let obj = {};
                    obj.TaskId = parseInt(id);
                    obj.UserId = parseInt(value);

                    swal({
                        title: "Are you sure?",
                        text: `You will assign task`,
                        buttons: {
                            cancel: true,
                            confirm: true,
                            closeModal: false
                        },
                    }).then(function (isConfirm) {
                        if (isConfirm === true) {
                            $.ajax({
                                    url: "https://localhost:44335/taskuser/postjson",
                                    type: "post",
                                    dataType: "json",
                                    data: obj,
                                    beforeSend: data => {
                                        data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
                                    },
                                })
                                .done((data) => {
                                    $("#tableProject").DataTable().ajax.reload();
                                    $("#detailProject").modal('hide'),
                                        swal(
                                            "Success!",
                                            `Task has been assigned`,
                                            "success"
                                        )
                                })
                                .fail((request) => {
                                    if (request.status == 400) {
                                        swal(
                                        `The Person Has been Assigned with that Task`,
                                        "Oops, Task was not assigned.",
                                        "error"
                                        )
                                    }
                                    if (request.status == 500) {
                                        swal(
                                            "Internal Server Error ! There is a problem with the server",
                                            "Contact the admin for further information.",
                                            "error"
                                        )
                                    }
                                });
                        }
                    })
                })
            }
        })
    })
}