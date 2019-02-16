/* global $, Chart */

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

function init() {
    $("#form-1").submit(function(e) {
        e.preventDefault();
        
        var datasets = [];
        
        for (var i = 1; i < 4; i++) {
            var initial_age = Number($('#inp_current_age-' + i).val());
            var initial_nest_egg = Number($("#inp_curr_nest_egg-" + i).val());
            var initial_salary = Number($("#inp_curr_salary-" + i).val());
            var annual_contrib_percent = Number($("#inp_contribution_percent-" + i).val()) / 100;
            var retire_age = Number($("#inp_retire_age-" + i).val());
            var annual_nest_egg_grow_percent = Number($("#inp_nest_egg_growth-" + i).val()) / 100;
            var lame_age = Number($("#inp_lame_age-"+i).val());
            var death_age = Number($("#inp_death_age-"+i).val());
            var active_years_income = Number($("#inp_active_years_income-"+i).val());
            var lame_years_income = Number($("#inp_inactive_years_income-"+i).val());
            
            var result = calculate(initial_age, initial_nest_egg, initial_salary, annual_contrib_percent, 
                       retire_age, annual_nest_egg_grow_percent, lame_age, death_age, 
                       active_years_income, lame_years_income);
            datasets.push(result);
        }
        drawCharts(datasets[0], datasets[1], datasets[2]);
    });
}


function drawCharts(data1, data2, data3) {
    var nesteggValues1 = data1.map(obj => { return obj.nest_egg; });
    var ages1 = data1.map(obj => { return obj.age; });
    
    var nesteggValues1Sampled = nthArray(nesteggValues1, 4);
    var ages1Sampled = nthArray(ages1, 4);
    
    var nesteggValues2 = data2.map(obj => { return obj.nest_egg; });
    var ages2 = data2.map(obj => { return obj.age; });
    
    var nesteggValues2Sampled = nthArray(nesteggValues2, 4);
    
    var nesteggValues3 = data3.map(obj => { return obj.nest_egg; });
    var ages3 = data3.map(obj => { return obj.age; });
    
    var nesteggValues3Sampled = nthArray(nesteggValues3, 4);
    
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
            // scales: {
            //     xAxes: [{
            //         ticks: {
            //             maxTicksLimit: 11
            //         }
            //     }]
            // }
        }
    });
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
            nest_egg_draw = active_years_income;
        } else if (age >= retire_age && age >= lame_age) { // in lame years
            nest_egg_draw = lame_years_income;
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
        // console.log(yearData);
        returnData.push(yearData);
        // console.log("age:", age, "retired:", is_retired, "salary:", round(current_salary, 2), 
        // "contrib:", round(contribution, 2), "draw:", nest_egg_draw, "interest:", round(interest, 2), "nest egg:", round(current_nest_egg, 2));
    }
    
    return returnData;
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