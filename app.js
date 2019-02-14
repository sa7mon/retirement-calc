/* global $ */

var initial_age = 25;
var initial_nest_egg = 2000;
var initial_salary = 60000;
var annual_contrib_percent = 0.08;
var retire_age = 66;
var annual_nest_egg_grow_percent = 0.04;
var death_age = 100;

function init() {
    // initial_age = $("#inp_initial_age").val();
    
    calculate();
}

function calculate() {
    var principal = initial_nest_egg;
    var current_salary = initial_salary;
    
    for (var age = initial_age; age < retire_age; age++) {
        // Annual contribution from salary at start of compounding period
        principal += current_salary * annual_contrib_percent;
        
        var interest = principal * annual_nest_egg_grow_percent;
        principal += interest;
        console.log("age: ", age, " principal: ", round(principal, 2), " interest: ", round(interest, 2));
    }
}

function round(value, decimals) {
    /* http://www.jacklmoore.com/notes/rounding-in-javascript/ */
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}