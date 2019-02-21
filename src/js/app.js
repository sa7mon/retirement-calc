/* global $, Chart */

var chart1;
var chart2;

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var rmds = {
    /* https://www.irs.gov/pub/irs-tege/uniform_rmd_wksht.pdf */
    70: 27.4,
    71: 26.5,
    72: 25.6,
    73: 24.7,
    74: 23.8,
    75: 22.9,
    76: 22.0,
    77: 21.2,
    78: 20.3,
    79: 19.5,
    80: 18.7,
    81: 17.9,
    82: 17.1,
    83: 16.3,
    84: 15.5,
    85: 14.8,
    86: 14.1,
    87: 13.4,
    88: 12.7,
    89: 12.0,
    90: 11.4,
    91: 10.8,
    92: 10.2,
    93: 9.6,
    94: 9.1,
    95: 8.6,
    96: 8.1,
    97: 7.6,
    98: 7.1,
    99: 6.7,
    100: 6.3,
    101: 5.9
}

var temp_datasets;

function init() {
    $("#form-1").submit(function(e) {
        e.preventDefault();
        
        $(".chart-row").removeClass("hidden");
        $("#table-row").removeClass("hidden");
        $("#output-row").removeClass("hidden");
        
        var datasets = [];
        
        for (var i = 1; i < 4; i++) {
            var initial_age = Number($('#inp_current_age-1').val());
            var initial_nest_egg = Number($("#inp_curr_nest_egg-" + i).val());
            var initial_salary = Number($("#inp_curr_salary-" + i).val());
            var annual_contrib_percent = Number($("#inp_contribution_percent-" + i).val()) / 100;
            var retire_age = Number($("#inp_retire_age-" + i).val());
            var annual_nest_egg_grow_percent = Number($("#inp_nest_egg_growth-" + i).val()) / 100;
            var lame_age = Number($("#inp_lame_age-"+i).val());
            var death_age = Number($("#inp_death_age-1").val());
            var active_years_income = Number($("#inp_active_years_income-"+i).val());
            var lame_years_income = Number($("#inp_inactive_years_income-"+i).val());
            
            var result = calculate(initial_age, initial_nest_egg, initial_salary, annual_contrib_percent, 
                       retire_age, annual_nest_egg_grow_percent, lame_age, death_age, 
                       active_years_income, lame_years_income);
            // console.log(result);
            
            datasets.push(result);
        }
        temp_datasets = datasets;
        drawChart1(datasets[0], datasets[1], datasets[2], 2);
        drawChart2(datasets[0], datasets[1], datasets[2], 2);
        createTable(datasets);
        showOutput(datasets);
    });
}

function showOutput(datasets) {
    for (var j = 0; j < 3; j++) {
        var highest_nest_egg = 0;
        var total_income = 0;
        
        for (var i = 0; i < datasets[j].length; i++) {
            var year = datasets[j][i];
            if (year.nest_egg > highest_nest_egg) {
                highest_nest_egg = year.nest_egg;
            }
            total_income += year.draw;
        }
        // console.log("Run " + (j+1) + " Max: ", highest_nest_egg);
        $("#max-egg-run-"+(j+1)).text("$"+addCommas(round(highest_nest_egg, 2)));
        $("#total-received-"+(j+1)).text("$"+addCommas(round(total_income, 2)));
    }
}

function createTable(datasets) {
    $("table#table thead tr").append("<td><strong>Age</strong></td>");
    $("table#table thead tr").append("<td><strong>Run 1</strong></td>");
    $("table#table thead tr").append("<td><strong>Run 2</strong></td>");
    $("table#table thead tr").append("<td><strong>Run 3</strong></td>");
    
    for (var i = 0; i < datasets[0].length; i++) {
        $("table#table tbody").append(`<tr>
        <td>${datasets[0][i].age}</td>
        <td>$${datasets[0][i].nest_egg}</td>
        <td>$${datasets[1][i].nest_egg}</td>
        <td>$${datasets[2][i].nest_egg}</td>
        </tr>`);
    }
}

function drawChart2(data1, data2, data3, sampleRate) {
    var drawValues1 = data1.map(obj => { return obj.draw; });
    var drawValues1Sampled = nthArray(drawValues1, sampleRate);
    
    var drawValues2 = data2.map(obj => { return obj.draw; });
    var drawValues2Sampled = nthArray(drawValues2, sampleRate);
    
    var drawValues3 = data3.map(obj => { return obj.draw; });
    var drawValues3Sampled = nthArray(drawValues3, sampleRate);
    
    var ages1 = data1.map(obj => { return obj.age; });
    var ages1Sampled = nthArray(ages1, sampleRate);
    
    if (chart2 !== undefined) {
        // console.log("Destroying chart2 before re-drawing");
        chart2.destroy();
    }
    
    var ctx = $("#chart-2");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ["25", "35", "40", "55", "60"],
            labels: ages1Sampled,
            datasets: [{
                // label: '# of Votes',
                // data: [12000, 13500, 15000, 17500, 19000],
                data: drawValues1Sampled,
                fill: false,
                // pointRadius: 0,
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                label: 'Run 1'
            },{
                data: drawValues2Sampled,
                fill: false,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                label: 'Run 2'
            },{
                data: drawValues3Sampled,
                fill: false,
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                label: 'Run 3'
            }]
        },
        options: {
            // maintainAspectRatio: true,
            layout: {
                padding: {
                    right: 20,
                }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                         return "$" + tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");  
                    }
                }
            },
            legend: {
                labels: {
                    fontColor: "#FFF",
                }  
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(label, index, labels) {
                            return "$" + addCommas(label);
                        },
                        fontColor: "#FFF",
                    }, 
                    gridLines: {
                        color: "rgba(255, 255, 255, 0.2)",
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "#FFF",
                    },
                    gridLines: {
                        color: "rgba(255, 255, 255, 0.2)",
                    }
                }]
            }
        }
    });
    
    chart2 = myChart;
}


function drawChart1(data1, data2, data3, sampleRate) {
    var nesteggValues1 = data1.map(obj => { return obj.nest_egg; });
    var ages1 = data1.map(obj => { return obj.age; });
    
    var nesteggValues1Sampled = nthArray(nesteggValues1, sampleRate);
    var ages1Sampled = nthArray(ages1, sampleRate);
    
    var nesteggValues2 = data2.map(obj => { return obj.nest_egg; });
    // var ages2 = data2.map(obj => { return obj.age; });
    
    var nesteggValues2Sampled = nthArray(nesteggValues2, sampleRate);
    
    var nesteggValues3 = data3.map(obj => { return obj.nest_egg; });
    // var ages3 = data3.map(obj => { return obj.age; });
    
    var nesteggValues3Sampled = nthArray(nesteggValues3, sampleRate);
    
    if (chart1 !== undefined) {
        // console.log("Destroying chart1 before re-drawing");
        chart1.destroy();
    }
    
    var ctx = $("#chart-1");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ["25", "35", "40", "55", "60"],
            labels: ages1Sampled,
            datasets: [{
                // label: '# of Votes',
                // data: [12000, 13500, 15000, 17500, 19000],
                data: nesteggValues1Sampled,
                fill: false,
                // pointRadius: 0,
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                label: 'Run 1'
            },{
                data: nesteggValues2Sampled,
                fill: false,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                label: 'Run 2'
            },{
                data: nesteggValues3Sampled,
                fill: false,
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                label: 'Run 3'
            }]
        },
        options: {
            // maintainAspectRatio: true,
            layout: {
                padding: {
                    right: 20,
                }
            }, 
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                         return "$" + tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");  
                    }
                }
            },
            legend: {
                labels: {
                    fontColor: "#FFF",
                }  
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(label, index, labels) {
                            return "$" + addCommas(label);
                        },
                        fontColor: "#FFF",
                    }, 
                    gridLines: {
                        color: "rgba(255, 255, 255, 0.2)",
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "#FFF",
                    },
                    gridLines: {
                        color: "rgba(255, 255, 255, 0.2)",
                    }
                }]
            }
        }
    });
    
    chart1 = myChart;
}

/**
 * All params should be Numbers. Any percents should be less than 1 (i.e. 0.08)
 */
function calculate(initial_age, initial_nest_egg, initial_salary, annual_contrib_percent, 
                    retire_age, annual_nest_egg_grow_percent, lame_age, death_age, 
                    active_years_income, lame_years_income) {
                        
    /* Order of operations
     * 
     * Not retired
     *  - Increase salary by percent
     *  - Make contribution from salary
     *  - Compound the interest
     * 
     * Retired
     *  - Draw from nest egg
     *  - Compound the interest
     */
    
    var returnData = [];
    var current_nest_egg = initial_nest_egg;
    var current_salary = initial_salary;
    
    for (var age = initial_age + 1; age <= death_age; age++) {
        var nest_egg_draw = 0;
        var is_retired = age >= retire_age ? true : false
        
        // Yearly salary increase
        current_salary = age >= retire_age ? 0 : current_salary + (current_salary * 0.02)
        
        // Annual contribution from salary at start of compounding period
        var contribution = age >= retire_age ? 0 : current_salary * annual_contrib_percent;
        current_nest_egg += contribution;
        
        // Draw from nest egg if retired
        if (age >= retire_age && age < lame_age) { // in active retirement years
            // console.log("age:", age, "draw:", active_years_income, "rmd:", getRmd(age, current_nest_egg));
            var rmd = getRmd(age, current_nest_egg);
            nest_egg_draw = active_years_income > rmd ? active_years_income : rmd 
        } else if (age >= retire_age && age >= lame_age) { // in lame years
            // console.log("age:", age, "draw:", lame_years_income, "rmd:", getRmd(age, current_nest_egg));
            var rmd = getRmd(age, current_nest_egg);
            nest_egg_draw = lame_years_income > rmd ? lame_years_income : rmd;
        }
        current_nest_egg -= nest_egg_draw
        
        // Set nestegg to 0 if we've gone below 0
        if (current_nest_egg < 0) {
            current_nest_egg = 0;
        }
        
        // Compute interest and add to total
        var interest = current_nest_egg * annual_nest_egg_grow_percent;
        current_nest_egg += interest;
        
        var yearData = {age: age, retired: is_retired, salary: round(current_salary, 2),
            contrib: round(contribution, 2), draw: nest_egg_draw, interest: round(interest, 2),
            nest_egg: round(current_nest_egg, 2)
        };
        
        returnData.push(yearData);
    }
    
    return returnData;
}

function getRmd(age, nestegg_value) {
    if (rmds[age] == undefined) {
        return 0;   
    }
    
    return nestegg_value / rmds[age];
}


function round(value, decimals) {
    /* http://www.jacklmoore.com/notes/rounding-in-javascript/ */
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function nthArray(array, n) {
    var returnArray = [];
    for (var i = 0; i < array.length; i=i+n) {
      returnArray.push(array[i]);
    }
    return returnArray;
}

function addCommas(nStr) {
    /** https://stackoverflow.com/a/26567557/2307994 **/
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}