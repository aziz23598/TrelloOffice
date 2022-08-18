$.ajax({
    url: "https://localhost:44335/project/GetJSON"
}).done((result) => {
    let totalProject =
        `
    <h5 class="card-title text-uppercase text-muted mb-0">Total Project</h5>
    <span class="h2 font-weight-bold mb-0">${result.data.length}</span>
    `;
    $("#totalProject").html(totalProject);
})

$.ajax({
    url: "https://localhost:44335/task/GetJSON"
}).done((result) => {
    let dueDate = [];
    let hashMap = {};

    //Get DueDate
    for (let i = 0; i < result.data.length; i++) {
        dueDate.push(result.data[i].DueDate)
    }

    //Pushing into HashMap
    for (let i = 0; i < dueDate.length; i++) {
        if (Object.keys(hashMap).length == 0) {
            hashMap[dueDate[i]] = 1;
            i++;
            if (i == dueDate.length) break;
        }
        if (dueDate[i] in hashMap) {
            hashMap[dueDate[i]] = hashMap[dueDate[i]] + 1;
        }
        if (dueDate[i] in hashMap == false) {
            hashMap[dueDate[i]] = 1;
        }
        
    }
    let backgroundClr = []
    for (let i = 0; i < result.data.length; i++) {
        if (result.data[i].IsCompleted == true) {
            backgroundClr.push('#2dce89');
        }
        if (result.data[i].IsCompleted == false) {
            backgroundClr.push('#f5365c');
        }
    }

    let dataBar = {
        labels: Object.keys(hashMap),
        datasets: [{
            label: 'Total Task',
            barPercentage: 0.1,
            barThickness: 100,
            maxBarThickness: 100,
            minBarLength: 2,
            data: Object.values(hashMap),
            backgroundColor: backgroundClr,
            hoverOffset: 4,
        }]
    }

    const plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const {
                ctx
            } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    const configBar = {
        type: 'bar',
        data: dataBar,
        plugins: [plugin],
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true   // minimum value will be 0.
                    }
                }]
            }
        },
    }

    const barChart = new Chart(
        document.getElementById('barChart'),
        configBar
    );
})

$(document).ready(() => {
    let table = $('#tableEmployeeAccountList').DataTable({
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
            "url": "https://localhost:44335/User/GetJSON",
            "dataType": "json",
        },
        "columns": [{
                "data": "UserId",
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                "data": "employee.Name"
            },
            {
                "data": "Email"
            },
            {
                "data": "Username"
            }
        ],
    })
})