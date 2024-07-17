const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"


d3.select('body')
    .append('h1')
    .text("fCC d3 Heatmap")
    .attr('id', 'title')

d3.select('body')
    .append('h3')
    .text('Temperature variance by month over years')
    .attr('id', 'description')

d3.json(url)
    .then(data => {
        const margin = { top: 20, right: 30, bottom: 40, left: 40 }
        const w = 1200 - margin.left - margin.right
        const h = 800 - margin.top - margin.bottom
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthNumbers = [0,1,2,3,4,5,6,7,8,9,10,11];

        const baseTemperature = data.baseTemperature
        const monthlyVariance = data.monthlyVariance

        const svg = d3.select('body')
                        .append('svg')
                        .attr('height', h + margin.top + margin.bottom)
                        .attr('width', w + margin.left + margin.right)
                        .append('g')
                        .attr('transform', `translate(${margin.left}, ${margin.top})`)


        const barWidth = w / (monthlyVariance.length / 12)
        const barHeight = h / 12

        const x = d3.scaleBand()
                        .domain(monthlyVariance.map((d) => d.year))
                        .range([0, w])

        const xAxis = d3.axisBottom(x)

        const y = d3.scaleBand()
                        .domain(monthNames)
                        .range([0, h])

        const yAxis = d3.axisLeft(y)
        

        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${h})`)
            .call(xAxis)

        svg.append('g')
            .attr('id', 'y-axis')
            .call(yAxis)

        const tooltip = d3.select('#tooltip')

        svg.selectAll('rect')
            .data(monthlyVariance)
            .enter()
            .append('rect')
            .attr('x', (d, i) => barWidth * Math.floor(((i)/12)))
            .attr('y', (d) => barHeight * (d.month - 1))
            .attr('height', y.bandwidth())
            .attr('width', x.bandwidth())
            .attr('class', 'cell')
            .attr('data-month', (d) => d.month - 1)
            .attr('data-year', (d) => d.year)
            .attr('data-temp', (d) => d.variance + baseTemperature)
            .attr('fill', (d) => {
                if (d.variance > 5) {
                    return 'red'
                } else if (d.variance > 3) {
                    return 'orange'
                } else if (d.variance > 1) {
                    return 'yellow'
                } else if (d.variance > -1) {
                    return 'white'
                } else if (d.variance > -3) {
                    return 'lightblue'
                } else if (d.variance > -5) {
                    return 'blue'
                } else {
                    return 'navy'
                }
                })

                
            .on('mouseover', (event, d)=> {
                tooltip.transition().style('opacity', .9)
                tooltip.style('left', (event.pageX + 10) + 'px')
                       .style('top', (event.pageY + 10) + 'px')
                       .attr('data-year', `${d.year}`)
                       .html(`Year: ${d.year}, Month: ${d.month}, Variance: ${d.variance}`); 
            })
            .on('mouseout', (event) => {
                tooltip.style('opacity', 0);
                })
})

const colors = ['navy', 'blue', 'lightblue', 'white', 'yellow', 'orange', 'red']

const legend = d3.select('body')
                    .attr('id', 'legend')
                    .append('svg')
                    .attr('height', 50)
                    .attr('width', 350)


legend.selectAll('rect')
        .data(colors)
        .enter()
        .append('rect')
        .attr('fill', d => d)
        .attr('height', '50')
        .attr('width', '50')
        .attr('x', (d, i) => i * 50 )