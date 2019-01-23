function showd3() {

    showCompletionChart("#simulation-d3",
        [{
            "component": "Geometry",
            "label": "MCH",
            "completion": 90
        },
        {
            "component": "Geometry",
            "label": "MID",
            "completion": 80
        },
        {
            "component": "Hit Creation",
            "label": "MCH",
            "completion": 50
        },
        {
            "component": "Hit Creation",
            "label": "MID",
            "completion": 25
        },
        {
            "component": "Digitization",
            "label": "MCH",
            "completion": 50
        },
        {
            "component": "Digitization",
            "label": "MID",
            "completion": 25
        }
        ],
        {
            top: 15,
            right: 30,
            bottom: 50,
            left: 250
        },
            {
                    width:900,
                    height:400
            }
    )

    showCompletionChart("#reconstruction-d3",
        [{
            "component": "(Pre+)Clustering",
            "label": "MID",
            "completion": 80
        },
        {
            "component": "Tracking",
            "label": "MID",
            "completion": 80
        },
        {
            "component": "Pre clustering",
            "label": "MCH",
            "completion": 80
        },
        {
            "component": "Clustering",
            "label": "MCH",
            "completion": 10
        },
        {
            "component": "Track fitting",
            "label": "MCH",
            "completion": 40
        },
        {
            "component": "Track finding",
            "label": "MCH",
            "completion": 10
        }
        ],
        {
            top: 15,
            right: 30,
            bottom: 50,
            left: 250
        },
            {
                    width:900,
                    height:400
            }
    )
}

function showCompletionChart(key,data,margin,svgsize)
{
    var svgWidth = svgsize.width
    var svgHeight = svgsize.height

    var width = svgWidth - margin.left - margin.right
    var height = svgHeight - margin.top - margin.bottom

    var svg = d3.select(key).select("svg")

    if (!svg.empty()) {
        return 
    }

    svg = d3.select(key)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    // svg.style("background","yellow")
        
    var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("fill", "transparent")

    var chartBackground = chart.append("g").append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)

    // chartBackground.style("fill", "#EEEE")

    var x = d3.scaleLinear()
        .range([0,width]) 
        .domain([0,100])

    var y = d3.scaleBand()
        .range([0,height])
        .domain(data.map(function(d,i) { return i }))
        .paddingInner(0.1)

    var colorScale = d3.scaleQuantize()
        .domain([0,100])
        .range(d3.schemeRdYlGn[11])

    var bars = chart.selectAll("rect .bar").data(data)
        .enter().append("rect").attr("class",".bar")
        .attr("fill",function(d) {
            return colorScale(d.completion)
        })
        .attr("width",0)
        .attr("height",function(d) {
            return y.bandwidth()
        })
        .attr("y",function(d,i) {
            return y(i)
        })
        .attr("x",0)
       
    bars.transition()
        .attr("width",function(d) {
            return x(d.completion)
        })
        .delay(function(d,i) {
            return i*20
        })

    chart.selectAll("text .label").data(data)
        .enter().append("text").attr("class","label")
        .attr("y",function(d,i) {
            return y(i) + 0.5* y.bandwidth()
        })
        .attr("x",function(d) {
                return x(d.completion)+20
        })
        .text(function(d) {
                return d.label
        }).style("fill","black").style("font-size","20px")
        
    // x-axis generator
    var xAxis = d3.axisBottom(x).ticks(5)

    chart.append("g")
        .attr("class","axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(function(g) {
            styleAxis(g,xAxis)
        })

    var yScale = d3.scaleBand()
        .range([0,height])
        .domain(data.map(function(d) {
            return d.component
            // return d.component + "(" + d.label + ")"
        }))

    var yAxis = d3.axisLeft(yScale)

    chart.append("g")
        .attr("class","axis y")
        .call(function(g) {
            styleAxis(g,yAxis)
        })
}

function styleAxis(g,axis) {
    g.call(axis)
    g.selectAll("line").remove()
    g.select(".domain").remove()
    g.selectAll("text").style("font-size","32px")
}
