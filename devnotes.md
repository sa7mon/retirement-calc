# Dev Notes

## 2/13/19
* Initially, I got a little ambitious and started adding form fields to handle all the inputs, but got confused and overwhelmed quickly. 
* I took a step back and broke down the requirements into small pieces. The first of these I determined to be just getting a simple compound interest function working in code without taking any inputs from the page
* After thinking about it for a while, I figured the easiest way to arrange the method was to make a for loop that iterates from the age at which the retirement account starts, to the defined death age.
* Probably took 20-30 minutes to get it working correctly. I verified the answers with an online compound interest calculator


## 2/15/19
* Add the incrase in salary per year
* Need to get some things clarified by Dr. V
* Added the different draws based on retirement status (active vs inactive)
* After testing, I found that it worked very well, except that once the nest egg value hit 0, the function would continue to draw income from it leaving a very negative number. Fixed this to bottom out at $0.
* After this, I started adding back the proper form fields to get input from the user and connecting those fields to the calculation method
* I knew I was going to be feeding this calculated data to a charting library, so I created a global array which would hold calculation data from each year of maturation and withdrawl. 
* I then started looking around for a good Javascript charting library. During Phase 1 I had used D3.js, but that proved to be quite a challenge to use. I came across chart.js and decided to try it.
* After getting a simple proof-of-concept chart working, I got the value-over-time chart working with the real data
* Initially, there were too many datapoints and the chart was messy and crowded, so I added a method that would take a sample from the age data i.e. only 1 year from every 5 years was used for the chart.
* I also added a function to round the floats to 2 decimal points when shown to the end user. In the calculations they remain as floating point decimals, but for the purposes of display we only want 2 places.

## 2/16/19
* Got the income-over-time chart working and hid both charts initially, until the user submits the form
* Added commas to the tooltip and axes labels on the charts
* Created a table to output all the returned data, but ultimately decided this didn't add much value and was very large

## 2/17/19
