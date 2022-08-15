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
        <div class="form-row" id="form-post">
            <div class="col-md-6 mb-3">
                <label for="projectName">Project Name</label>
                <input asp-for="Name" name="projectName" type="text" class="form-control form-control-alternative"
                    id="projectName" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    Please Input Valid Project Name!
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="Description">Description</label>
                <input asp-for="Description" name="description" type="text" class="form-control form-control-alternative"
                    id="description" required>
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
        <div class="form-row">
            <div class="col-md-4 mb-3">
                    <label for="projectId">Project Id</label>
                    <input name="projectId" type="number" class="form-control form-control-alternative"
                        id="projectId" value=${result.data.ProjectId} readonly required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            <div class="col-md-4 mb-3">
                <label for="name">Project Name</label>
                <input id="name" type="text" class="form-control form-control-alternative"
                         value="${result.data['Name']}" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <label for="description">Description</label>
                <input id="description" type="text" class="form-control form-control-alternative"
                         value="${result.data['Description']}" required>
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
        let detailModalBody =
            `
        <div class="form" id="form-post">
            <div class="col mb-3">
                <i class='ni ni-bag-17'></i>
                <label for="projectName">Project Name</label>
                <input asp-for="Name" name="projectName" type="text" class="form-control form-control-alternative"
                    id="projectName" value="${result.data.Name}" readonly required>
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    Please Input Valid Project Name!
                </div>
            </div>
            <div class="col mb-3">
                <i class='ni ni-align-left-2'></i>
                <label for="Description">Description</label>
                <input asp-for="Description" name="description" type="text" class="form-control form-control-alternative"
                    id="description" value="${result.data.Description}" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    Please Input Valid Description!
                </div>
            </div>
            <div class="col mb-3" id="taskList">
            </div>
            <div class="col mb-3" id="addTaskSection">
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
                <i class='ni ni-check-bold'></i>
                    <label for="Task">Checklist Task</label>
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
                                    <button class="btn btn-warning btn-sm" type="button" data-toggle="collapse" data-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample${i}">
                                        Edit Task
                                    </button>
                                    <button class="btn btn-icon btn-danger btn-sm" type="button">
	                                    <span class="btn-inner--icon"><i class="ni ni-fat-remove"></i></span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div class="collapse" id="collapseExample${i}">
                                    <div class="card card-body">
                                    <div class="form" id="form-post">
                                    <input name="taskId" type="number" class="form-control form-control-alternative"
                                            id="taskId${i}" value="${result.data[i].TaskId}" hidden required>
                                    <div class="col mb-3">
                                        <label for="taskName">Task Name</label>
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
                                        <label for="taskDescription">Task Description</label>
                                        <input name="taskDescription" type="textarea" class="form-control form-control-alternative"
                                            id="taskDescription${i}" value="${result.data[i].Description}" required>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div class="invalid-feedback">
                                            Please Input Valid Project Name!
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <label for="dueDateInput">Due Date</label>
                                        <input class="form-control form-control-alternative" name="dueDateInput" placeholder="Select date" type="date" 
                                            id="dueDateInput${i}" value="${result.data[i].DueDate}" required>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div class="invalid-feedback">
                                            Please Input Valid Description!
                                        </div>
                                    </div>
                                    <button type="button" id="editTaskBtn${i}" class="btn btn-warning">Edit Task</button>
                                </div>          
                                    </div>
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
                                    <button class="btn btn-warning btn-sm" type="button" data-toggle="collapse" data-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample${i}">
                                        Edit Task
                                    </button>
                                    <button class="btn btn-icon btn-danger btn-sm" type="button">
	                                    <span class="btn-inner--icon"><i class="ni ni-fat-remove"></i></span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div class="collapse" id="collapseExample${i}">
                                    <div class="card card-body">
                                        <div class="form" id="form-post">
                                            <input name="taskId" type="number" class="form-control form-control-alternative"
                                                id="taskId${i}" value="${result.data[i].TaskId}" hidden required>
                                            <div class="col mb-3">
                                            <label for="taskName">Task Name</label>
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
                                            <label for="taskDescription">Task Description</label>
                                            <input name="taskDescription" type="textarea" class="form-control form-control-alternative"
                                                id="taskDescription${i}" value="${result.data[i].Description}" required>
                                            <div class="valid-feedback">
                                                Looks good!
                                            </div>
                                            <div class="invalid-feedback">
                                                Please Input Valid Project Name!
                                            </div>
                                        </div>
                                        <div class="col mb-3">
                                            <label for="dueDateInput">Due Date</label>
                                            <input class="form-control form-control-alternative" name="dueDateInput" placeholder="Select date" type="date" id="dueDateInput${i}" value="${result.data[i].DueDate}" required>
                                            <div class="valid-feedback">
                                                Looks good!
                                            </div>
                                            <div class="invalid-feedback">
                                                Please Input Valid Description!
                                            </div>
                                        </div>
                                        <button type="button" id="editTaskBtn${i}" class="btn btn-primary">Edit Task</button>
                                    </div>          
                                </div>
                            </li>
                        `
                    }
                    
                }
                
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
                    obj.TaskId = parseInt($(`#taskId${i}`).val());
                    obj.ProjectId = result.data[id].ProjectId;
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
            <div class="collapse" id="collapseAddTask">
                <div class="card card-body">
                <div class="form" id="form-post">
                <div class="col mb-3">
                    <label for="taskAddName">Task Name</label>
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
                    <label for="taskAddDescription">Task Description</label>
                    <input name="taskAddDescription" type="textarea" class="form-control form-control-alternative"
                        id="taskAddDescription" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please Input Valid Project Name!
                    </div>
                </div>
                <div class="col mb-3">
                    <label for="dueDateAddInput">Due Date</label>
                    <input class="form-control form-control-alternative" name="dueDateAddInput" placeholder="Select date" type="date" id="dueDateAddInput" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please Input Valid Description!
                    </div>
                </div>
                <button type="button" id="addTaskBtn" class="btn btn-primary">Submit Task</button>
            </div>          
                </div>
            </div>
            
            `;
            $("#addTaskSection").html(addTaskSection);
            $("#addTaskBtn").on('click', () => {
                let obj = {};
                obj.ProjectId = result.data[id].ProjectId;
                obj.Name = $("#taskAddName").val();
                obj.Description = $("#taskAddDescription").val();
                let dueDates = new Date($('#dueDateAddInput').val());
                dueDates = dueDates.toISOString().slice(0, 10).replace('T', ' ');
                obj.DueDate = dueDates;
                obj.IsCompleted = false;
                console.log(obj);
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
            
        })
    });

}

console.log("This is Session User Id" + $("#sessionUserId").val());