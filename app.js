/* global $ */

var initial_age = 25;
var initial_nest_egg = 2000;
var initial_salary = 60000;
var annual_contrib_percent = 0.08;
var retire_age = 66;
var lame_age = 80;
var annual_nest_egg_grow_percent = 0.04;
var death_age = 100;
var active_years_income = 40000;
var lame_years_income = 25000

function init() {
    // initial_age = $("#inp_initial_age").val();
    calculate();
}

function calculate() {
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
        } else if (age >= retire_age && age > lame_age) { // in lame years
            nest_egg_draw = lame_years_income;
        }
        current_nest_egg -= nest_egg_draw
        
        // Compute interest and add to total
        var interest = current_nest_egg * annual_nest_egg_grow_percent;
        current_nest_egg += interest;
        
        console.log("age:", age, "retired:", is_retired, "salary:", round(current_salary, 2), 
        "contrib:", contribution, "draw:", nest_egg_draw, "interest:", round(interest, 2), "nest-egg:", round(current_nest_egg, 2));
    }
}


function round(value, decimals) {
    /* http://www.jacklmoore.com/notes/rounding-in-javascript/ */
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}