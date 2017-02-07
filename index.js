function drawGraphs(){
    var svgBar = d3.select("body").append("svg").attr("width","500px").attr("height","650px");
    var svgPie = d3.select("body").append("svg").attr("width","500px").attr("height","650px");
    var svgScatter = d3.select("body").append("svg").attr("width","500px").attr("height","650px");

    var format = d3.format(".2s");

    function drawBar(){
        //filter table to mainBar
        var mainBar = data.tab97.filter(function(d){
            if (d.Race === "All ethnicities and races"){
                d.Total = d.All_Female + d.All_Male;
                return d;
            }
        });

        var tooltipDiv = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        var margin = {top: 40, right: 20, bottom: 150, left: 70},
            width = 500 - margin.left - margin.right,
            height = 650 - margin.top - margin.bottom;

        var x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);


        var svg = svgBar.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(mainBar.map(function(d) { return d.Science_Occupations; }));
        y.domain([0, d3.max(mainBar, function(d) { return d.Total; })]);

        svg.append("text")
            .attr("x", width / 2 - 200)
            .attr("y", -15)
            .style("font-weight", "bold")
            .style("font-size", "20px")
            .text("Number of Employees per Science Field");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)" );

        svg.append("text")      // text label for the x axis
            .attr("x", width / 2 - 75)
            .attr("y",  height + margin.bottom - 30)
            .style("font-weight", "bold")
            .text("Science Occupation");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", ".18em")
            .attr("dy", ".15em");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("Total Employees");

        svg.selectAll(".bar")
            .data(mainBar)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Science_Occupations); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.Total); })
            .attr("height", function(d) { return height - y((d.Total)); })
            .on("mouseover", function(d) {
                d3.select(this).style("cursor", "pointer");
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltipDiv.html(
                    "<span style='color:#afdef1'>" +
                    d.Science_Occupations + ": " + format(d.Total) + "</span>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default");
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on('click', drawPie);
    }

    function drawPie(selected) {
        svgPie.selectAll("*").remove();
        svgScatter.selectAll("*").remove();
        var mainPie = data.tab97.filter(function (d) {
            if (d.Race === "All ethnicities and races" &&
                d.Science_Occupations === selected.Science_Occupations)
                return d;
        });

        mainPie = [
            {
                degree: "Bachelor's",
                population: mainPie[0].Bachelors_Female,
                gender: "Female"},
            {
                degree: "Master's",
                population: mainPie[0].Masters_Female,
                gender: "Female"},
            {
                degree: "Doctorate's",
                population: mainPie[0].Doctorate_Female,
                gender: "Female"},
            {
                degree: "Bachelor's",
                population: mainPie[0].Bachelors_Male,
                gender: "Male"},
            {
                degree: "Master's",
                population: mainPie[0].Masters_Male,
                gender: "Male"},
            {
                degree: "Doctorate's",
                population: mainPie[0].Doctorate_Male,
                gender: "Male"}];

        var width = 500,
            height = 650,
            radius = Math.min(width, height) / 2;

        var color = [
            d3.schemeCategory20c[4],
            d3.schemeCategory20c[5],
            d3.schemeCategory20c[6],
            d3.schemeCategory20c[0],
            d3.schemeCategory20c[1],
            d3.schemeCategory20c[2]];

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);


        var labelArc = d3.arc()
            .outerRadius(radius - 100)
            .innerRadius(radius - 100);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) {
                return d.population;
            });

        var svg = svgPie
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg.append("text")
            .attr("x", -width/2)
            .attr("y", -height/2 + 25)
            .style("font-weight", "bold")
            .style("font-size", "20px")
            .text("Gender Breakdown of");

        svg.append("text")
            .attr("x", -width/2)
            .attr("y", -height/2 + 50)
            .style("font-weight", "bold")
            .style("font-size", "20px")
            .text(toTitleCase(selected.Science_Occupations) + "s");

        var g = svg.selectAll(".arc")
            .data(pie(mainPie))
            .enter().append("g")
                .attr("class", "arc")
            .on('click', function(d){
                drawScatter(selected, d);
            });

        g.append("path")
            .attr("d", arc)
            .style("fill", function (d, i) {
                return color[i];
            })
            .on('mouseover', function(d, i){
                d3.select(this).style("cursor", "pointer");
                d3.select(this).style("opacity", function(){
                    return 0.4;
                });
            })
            .on("mouseout", function(d, i) {
                d3.select(this).style("cursor", "default");
                d3.select(this).style("opacity", function(){
                    return 1;
                });
            });

        g.append("text")
            .attr("transform", function (d) {
                var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
                return "translate(" + labelArc.centroid(d) + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")";
            })
            // .attr("dy", ".35em")
            .text(function (d) {
                return d.data.degree + " " + d.data.gender + ": " + format(d.data.population);
            });
    }

    function drawScatter(selectedParent, selected){
        svgScatter.selectAll("*").remove();

        var salaryData = data.tab917.filter(function(d){
            if(d.Gender === selected.data.gender &&
                d.Science_Occupations === selectedParent.Science_Occupations){
                return d;
            }
        });
        function totalSalaryAmongAgeGroups(d, salaryData){
            if(d.Race in salaryData[0]) {
                var total = salaryData.reduce(function (a, b) {
                    var add1 = a[d.Race];
                    var add2 = b[d.Race];
                    if(!add1)
                        add1 = 0;
                    if(!add2)
                        add2 = 0;
                    return add1 + add2;
                });
                return total;
            }
            else
                return 0;
        }

        var mainScatter = data.tab97.filter(function(d){
            if(d.Race != "All ethnicities and races" &&
                d.Science_Occupations === selectedParent.Science_Occupations){
                        return d;
            }}).map(function(d){
            if(selected.data.gender == "Female"){
                return {
                    Job: d.Science_Occupations,
                    Race: d.Race,
                    Population: d.All_Female,
                    Salary: totalSalaryAmongAgeGroups(d, salaryData)
                };
            }
            else {
                return {
                    Job: d.Science_Occupations,
                    Race: d.Race,
                    Population: d.All_Male,
                    Salary: totalSalaryAmongAgeGroups(d, salaryData)
                };
            }});

        var margin = {top: 60, right: 220, bottom: 30, left: 60},
            width = 500 - margin.left - margin.right,
            height = 650 - margin.top - margin.bottom;

        // setup x
        var xValue = function(d) { return d.Population;}; // data -> value
        var xScale = d3.scaleLinear().range([0, width]); // value -> display
        var xMap = function(d) { return xScale(xValue(d));};// data -> display
        var xAxis = d3.axisBottom(xScale).ticks(4);

        // setup y
        var yValue = function(d) { return d.Salary;}, // data -> value
            yScale = d3.scaleLinear().range([height, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.axisLeft(yScale);

        // setup fill color
        var cValue = function(d) { return d.Race;},
            color = d3.scaleOrdinal()
                .range(d3.schemeCategory10);

        var scatter = svgScatter.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // don't want dots overlapping axis, so add in buffer to mainScatter domain
        xScale.domain([d3.min(mainScatter, xValue)-1, d3.max(mainScatter, xValue)+1]);
        yScale.domain([d3.min(mainScatter, yValue)-1, d3.max(mainScatter, yValue)+1]);

        scatter.append("text")
            .attr("x", width / 2 - 100)
            .attr("y", -30)
            .style("font-weight", "bold")
            .style("font-size", "15px")
            .text(selectedParent.Science_Occupations);

        // x-axis
        scatter.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
                .attr("class", "label")
                .attr("x", width/2)
                .attr("y", -6)
                .style("text-anchor", "end")
                .style("fill", "black")
                .text("Population");

        // y-axis
        scatter.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("x", -height/2)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("fill","black")
                .text("Salary");

        // draw dots
        scatter.selectAll(".dot")
            .data(mainScatter)
            .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 10.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", function(d) {return color(cValue(d));})
                .on("mouseover", function(d) {
                    d3.select(this).style("opacity", 0.5);
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("opacity", 1);
                });

        var legend = scatter.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(200," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {return d;});

    }

    drawBar();
    drawPie({Science_Occupations: "Biological/life scientist"});

}




function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}