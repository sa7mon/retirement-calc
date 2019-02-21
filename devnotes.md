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
* I found a sample theme that I like a lot, so I copied some of the colors and elements from it to give the page a dark theme
* After doing some testing with different input data, I determined it would just be too difficult to support runs with different starting and death ages, so I made them all share one form field for those ages
* After that, I added just a few lines of code to support chart re-drawing. Now if the user has submitted the form, they can scroll back up, edit the inputs, and re-calculate with no problem

## 2/19/19
* Since we moved to a dark theme, the chart needed to be styled with lighter colors so it didn't blend into the page background. Changed the labels and gridlines to be white or gray
* After taking some time to learn how RMD's work, I found a very simple worksheet on the IRS webiste to help calculate them [here](https://www.irs.gov/pub/irs-tege/uniform_rmd_wksht.pdf) 
* I hard-coded the ages and distribution periods into the program since I couldn't find a good way to programmatically extract the data easily from the pdf
* I successfully got the RMD calculations working and verified the charts looked roughly like the charts in the example from Dr. V
* I then changed the graphs from being 50% screen width to being 100% wide and each having their own row. This lets us see a lot more detail, so I lowered the sample rate from 5 to 2

## 2/20/19
* Since my MacBook doesn't have much screen real estate, I decided to make the navbar not stuck to the top of the screen. Now more of the page can be seen at one time. 
* After re-reading the spec for Phase 2, I realized that we need to output the maximum nest egg size and total amount received over the lifetime of the retirement account.
* I quickly got those 2 things to calculate and output to a field on the page
* Spent some time organizing the page a bit with headings and style tweaks
* I brought back the messy table I made before to show the nest egg size over time for each run 
* Took time to move from using CDN links of javascript and css frameworks to using npm to concat and minify everything
* This way, all necessary files will reside on the server and we won't depend on CDN links to stay valid since I won't be doing maintenance on this app after the class is over
* Deployed to AWS and tested to make sure it was accessible




