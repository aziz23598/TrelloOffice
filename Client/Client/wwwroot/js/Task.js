$(document).ready(() => {
    $.ajax({
        url: 'https://localhost:44335/taskuser/GetJSON',
        type: 'get'
    }).done((result) => {
        const hashProjectTask = {};
        // Hashmap for total Task per Project, Keys is ProjectId and Value is Total Task!
        let hashTask = {};
        for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].UserId == $("#sessionUserId").val()) {
                if (Object.keys(hashProjectTask).length == 0) {
                    hashProjectTask[result.data[i].task.project.ProjectId] = [];
                    hashTask["TaskId"] = result.data[i].TaskId;
                    hashTask["Name"] = result.data[i].task.Name;
                    hashTask["Description"] = result.data[i].task.Description;
                    hashTask["DueDate"] = result.data[i].task.DueDate;
                    hashTask["CategoryName"] = result.data[i].task.category.Name;
                    hashTask["IsCompleted"] = result.data[i].task.IsCompleted;
                    hashTask["ProjectName"] = result.data[i].task.project.Name;
                    hashTask["ProjectDescription"] = result.data[i].task.project.Description;
                    hashProjectTask[result.data[i].task.project.ProjectId]
                        .push(hashTask);
                    hashTask = {};
                    if (i == result.data.length - 1) break;
                }

                if (result.data[i].task.project.ProjectId in hashProjectTask) {
                    hashTask["TaskId"] = result.data[i].TaskId;
                    hashTask["Name"] = result.data[i].task.Name;
                    hashTask["Description"] = result.data[i].task.Description;
                    hashTask["DueDate"] = result.data[i].task.DueDate;
                    hashTask["CategoryName"] = result.data[i].task.category.Name;
                    hashTask["IsCompleted"] = result.data[i].task.IsCompleted;
                    hashTask["ProjectName"] = result.data[i].task.project.Name;
                    hashTask["ProjectDescription"] = result.data[i].task.project.Description;
                    hashProjectTask[result.data[i].task.project.ProjectId]
                        .push(hashTask);
                    hashTask = {};
                }

                if (result.data[i].task.project.ProjectId in hashProjectTask == false) {
                    hashProjectTask[result.data[i].task.project.ProjectId] = [];
                    hashTask["TaskId"] = result.data[i].TaskId;
                    hashTask["Name"] = result.data[i].task.Name;
                    hashTask["Description"] = result.data[i].task.Description;
                    hashTask["DueDate"] = result.data[i].task.DueDate;
                    hashTask["CategoryName"] = result.data[i].task.category.Name;
                    hashTask["IsCompleted"] = result.data[i].task.IsCompleted;
                    hashTask["ProjectName"] = result.data[i].task.project.Name;
                    hashTask["ProjectDescription"] = result.data[i].task.project.Description;
                    hashProjectTask[result.data[i].task.project.ProjectId]
                        .push(hashTask);
                    hashTask = {};
                }
            }
        }

        // Card DOM Manipulation
        let containerHtml = "";
        let totalProject = Object.keys(hashProjectTask).length;
        for (let i = 0; i < Object.keys(hashProjectTask).length; i++) {
            if (Object.values(hashProjectTask)[i].length > 1) {
                containerHtml +=
                    `
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${Object.values(hashProjectTask)[i][0].ProjectName}</h5>
                            <p class="card-text">${Object.values(hashProjectTask)[i][0].ProjectDescription}</p>
                            <a href="" onclick="detailTask(${Object.keys(hashProjectTask)[i]})" class="btn btn-primary" data-toggle="modal" data-target="#detailTask">Details</a>
                        </div>
                    </div>
                </div>
                
                `
            }
            if (Object.values(hashProjectTask)[i].length == 1) {
                containerHtml +=
                    `
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${Object.values(hashProjectTask)[i][0].ProjectName}</h5>
                            <p class="card-text">${Object.values(hashProjectTask)[i][0].ProjectDescription}</p>
                            <a href="" onclick="detailTask(${Object.keys(hashProjectTask)[i]})" class="btn btn-primary" data-toggle="modal" data-target="#detailTask">Details</a>
                        </div>
                    </div>
                </div>
                `
            }
        }
        $('#containerDOM').html(containerHtml);
    })
})



function detailTask(id) {
    $.ajax({
        url: 'https://localhost:44335/taskuser/GetJSON',
        type: 'get'
    }).done((result) => {
        // hashTask, Temporary variable for pushing data into an array of object, hashProjectTask
        let hashTask = {};
        // modalDetail, DOM Manipulation for modalDetail
        let modalDetail = "";
        // IndexById, Getting data based on index of HashProjectTask
        let indexById = 0;

        const hashProjectTask = {};
        for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].UserId == $("#sessionUserId").val()) {
                if (Object.keys(hashProjectTask).length == 0) {
                    hashProjectTask[result.data[i].task.project.ProjectId] = [];
                    hashTask["TaskId"] = result.data[i].TaskId;
                    hashTask["Name"] = result.data[i].task.Name;
                    hashTask["Description"] = result.data[i].task.Description;
                    hashTask["DueDate"] = result.data[i].task.DueDate;
                    hashTask["CategoryId"] = result.data[i].task.CategoryId;
                    hashTask["CategoryName"] = result.data[i].task.category.Name;
                    hashTask["IsCompleted"] = result.data[i].task.IsCompleted;
                    hashTask["ProjectName"] = result.data[i].task.project.Name;
                    hashTask["ProjectDescription"] = result.data[i].task.project.Description;
                    hashProjectTask[result.data[i].task.project.ProjectId]
                        .push(hashTask);
                    hashTask = {};
                    i++;
                    if (i == result.data.length) break;
                }

                if (result.data[i].task.project.ProjectId in hashProjectTask) {
                    hashTask["TaskId"] = result.data[i].TaskId;
                    hashTask["Name"] = result.data[i].task.Name;
                    hashTask["Description"] = result.data[i].task.Description;
                    hashTask["DueDate"] = result.data[i].task.DueDate;
                    hashTask["CategoryId"] = result.data[i].task.CategoryId;
                    hashTask["CategoryName"] = result.data[i].task.category.Name;
                    hashTask["IsCompleted"] = result.data[i].task.IsCompleted;
                    hashTask["ProjectName"] = result.data[i].task.project.Name;
                    hashTask["ProjectDescription"] = result.data[i].task.project.Description;
                    hashProjectTask[result.data[i].task.project.ProjectId]
                        .push(hashTask);
                    hashTask = {};
                }

                if (result.data[i].task.project.ProjectId in hashProjectTask == false) {
                    hashProjectTask[result.data[i].task.project.ProjectId] = [];
                    hashTask["TaskId"] = result.data[i].TaskId;
                    hashTask["Name"] = result.data[i].task.Name;
                    hashTask["Description"] = result.data[i].task.Description;
                    hashTask["DueDate"] = result.data[i].task.DueDate;
                    hashTask["CategoryId"] = result.data[i].task.CategoryId;
                    hashTask["CategoryName"] = result.data[i].task.category.Name;
                    hashTask["IsCompleted"] = result.data[i].task.IsCompleted;
                    hashTask["ProjectName"] = result.data[i].task.project.Name;
                    hashTask["ProjectDescription"] = result.data[i].task.project.Description;
                    hashProjectTask[result.data[i].task.project.ProjectId]
                        .push(hashTask);
                    hashTask = {};
                }
            }
        }
        indexById = Object.keys(hashProjectTask).indexOf(`${id}`);
        modalDetail +=
            `
        <div class="card">
                <div class="card-body">
                    <h2 class="card-title"><i class='ni ni-bag-17'></i> Project Name</h2>
                    ${Object.values(hashProjectTask)[indexById][0].ProjectName}
                </div>
        </div>
        <div class="card">
            <div class="card-body">
                <h2 class="card-title"><i class='ni ni-align-left-2'></i> Description</h2>
                ${Object.values(hashProjectTask)[indexById][0].ProjectDescription}
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <h2 class="card-title"><i class='ni ni-check-bold'></i>Checklist Task</h2>
                <div class="table-responsive">
                    <div>
                        <table class="table align-items-center" id="tableTask">
                            <thead class="thead-light text-center">
                                <tr>
                                    <th scope="col">No.</th>
                                    <th scope="col">Task Urgency</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Due Date</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        `
        $("#modalDetail").html(modalDetail);
        const taskListPerProject = Object.values(hashProjectTask)[indexById];
        let table = $('#tableTask').DataTable({
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
                    targets: [0, 1, 2, 3, 4, 5]
                },
            ],
            "data": taskListPerProject,
            "columns": [
                {
                    "data": "UserId",
                    render: function (data, type, row, meta) {
                        return meta.row + 1;
                    }
                },
                {
                    "data": "CategoryName",
                    render: function (data, type, row) {
                        return row['CategoryName'] == "Priority" ?
                            `<span class='badge-lg badge-pill badge-danger'>${row['CategoryName']}</span>` :
                            `<span class='badge-lg badge-pill badge-info'>${row['CategoryName']}</span>`;

                    },
                },
                {
                    "data": "Name"
                },
                {
                    "data": "Description"
                },
                {
                    "data": "DueDate",
                    render: function (data, type, row) {
                        return row['IsCompleted'] == true ?
                            `<span class='badge-lg badge-pill badge-success'>${row['DueDate']}</span>` :
                            `<span class='badge-lg badge-pill badge-warning'>${row['DueDate']}</span>`

                    },
                },
                {
                    /*"data": "task.IsCompleted",*/
                    render: function (data, type, row) {
                        return row['IsCompleted'] == true ?
                            `<button type="button" onclick="actionTask(${row['TaskId']})" class="btn btn-success">
                        Finished Task
                    </button>` :
                            `<button type="button" onclick="actionTask(${row['TaskId']})" class="btn btn-warning">
                        Unfinished Task
                    </button>`
                    }
                }
            ]
        });
    })
}

function actionTask(id) {
    $.ajax({
        url: `https://localhost:44335/task/getjsonbyid/${id}`,
        type: 'get'
    }).done((result) => {
        let check = "";
        let text = "";
        let obj = {};
        obj.TaskId = id;
        obj.ProjectId = result.data.ProjectId;
        obj.CategoryId = result.data.CategoryId;
        obj.Name = result.data.Name;
        obj.Description = result.data.Description;
        obj.DueDate = result.data.DueDate;
        if (result.data.IsCompleted == true) {
            check = false;
            text = `${obj.Name} will marked as not done`
        }
        if (result.data.IsCompleted == false) {
            check = true;
            text = `${obj.Name} will marked as done`
        }
        obj.IsCompleted = check;
        swal({
            title: "Are you sure?",
            text: text,
            buttons: {
                cancel: true,
                confirm: true,
                closeModal: false
            },
        }).then((isConfirm) => {
            if (isConfirm === true) {
                $.ajax({
                    url: "https://localhost:44335/task/editjson",
                    type: "put",
                    dataType: "json",
                    data: obj,
                    beforeSend: data => {
                        data.setRequestHeader("RequestVerificationToken", $("[name='__RequestVerificationToken']").val());
                    },
                    success: () => {
                        $(window).on("load");
                        $("#detailTask").modal('hide'),
                            swal(
                                "Success",
                                `${obj.Name} has been changed`,
                                "success"
                            )
                    },
                    failure: () => {
                        swal(
                            "Internal Server Error",
                            `Oops, ${obj.Name} was not saved`,
                            "error"
                        )
                    }
                })
            }
        })
    });
}