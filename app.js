/* global $ */

function init() {
    
    $("#form-1").submit(function(e) {
        e.preventDefault();
        console.log("Form submitted");
        
        var initial_age = Number($('#inp_current_age').val());
        var initial_nest_egg = Number($("#inp_curr_nest_egg").val());
        var initial_salary = Number($("#inp_curr_salary").val());
        var annual_contrib_percent = Number($("#inp_contribution_percent").val()) / 100;
        var retire_age = Number($("#inp_retire_age").val());
        var annual_nest_egg_grow_percent = Number($("#inp_nest_egg_growth").val()) / 100;
        var lame_age = Number($("#inp_lame_age").val());
        var death_age = Number($("#inp_death_age").val());
        var active_years_income = Number($("#inp_active_years_income").val());
        var lame_years_income = Number($("#inp_inactive_years_income").val());
        
        calculate(initial_age, initial_nest_egg, initial_salary, annual_contrib_percent, 
                   retire_age, annual_nest_egg_grow_percent, lame_age, death_age, 
                   active_years_income, lame_years_income);
    });
    
}

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
        
        console.log("age:", age, "retired:", is_retired, "salary:", round(current_salary, 2), 
        "contrib:", round(contribution, 2), "draw:", nest_egg_draw, "interest:", round(interest, 2), "nest egg:", round(current_nest_egg, 2));
    }
}


function round(value, decimals) {
    /* http://www.jacklmoore.com/notes/rounding-in-javascript/ */
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}