$.ajax({
    url: "https://localhost:44335/taskuser/GetJSON"
}).done((result) => {
    let totalTask = 0;
    let totalTaskDone = 0;
    for (let i = 0; i < result.data.length; i++) {
        if (result.data[i].UserId == $("#sessionUserId").val()) {
            totalTask += 1;
            if (result.data[i].task.IsCompleted == true) {
                totalTaskDone += 1;
            }
        }
    }
    let totalTaskHTML =
        `
    <h5 class="card-title text-uppercase text-muted mb-0">Total Task</h5>
    <span class="h2 font-weight-bold mb-0">${totalTask}</span>
    `;
    $("#totalTask").html(totalTaskHTML);

    let totalTaskDoneHTML =
        `
    <h5 class="card-title text-uppercase text-muted mb-0">Total Task Done</h5>
    <span class="h2 font-weight-bold mb-0">${totalTaskDone}</span>
    `;
    $("#totalTaskDone").html(totalTaskDoneHTML);
    let dueDate = [];
    let hashMap = {};

    //Get DueDate
    for (let i = 0; i < result.data.length; i++) {
        if (result.data[i].UserId == $("#sessionUserId").val()) 
        dueDate.push(result.data[i].task.DueDate)
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
    for (let i = 0; i < Object.keys(hashMap).length; i++) {
        for (let y = 0; y < result.data.length; y++) {
            if (Object.keys(hashMap)[i] == result.data[y].task.DueDate && $("#sessionUserId").val() == result.data[y].UserId) {
                if (result.data[y].task.IsCompleted == true) {
                    backgroundClr.push('#2dce89');
                }
                if (result.data[y].task.IsCompleted == false) {
                    backgroundClr.push('#f5365c');
                }
            }

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