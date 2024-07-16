const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"


d3.select('body')
    .append('h1')
    .text("fCC d3 Heatmap")
    .attr('id', 'title')

d3.json(url)
    .then(data => {
        console.log(data)
        const w = 1200
        const h = 800

        const baseTemperature = data.baseTemperature
        const monthlyVariance = data.monthlyVariance

        const monthlyData = monthlyVariance.map(d => ({
            'year': d.year,
            'month': d.month,
            'variance': d.variance
        }))

        console.log(d3.max(monthlyVariance, (d) => d.variance))

        const svg = d3.select('body')
                        .append('svg')
                        .attr('height', h)
                        .attr('width', w)


        const barWidth = w / (monthlyVariance.length / 12)
        const barHeight = h / 12

        const x = d3.scaleLinear()
                        .domain([d3.min(monthlyVariance, d => d.year), d3.max(monthlyVariance, d => d.year)])
                        .range([0, w])

        const y = d3.scaleLinear()
                        .domain(1, 12)
                        .range([h, 0])

        const xAxis = d3.axisBottom(x)
                        .tickFormat(d3.format('d'))


        const yAxis = d3.axisLeft(y)
                        .tickFormat(d3.format('d'))

        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${h})`)
            .call(xAxis)

        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, 0)`)
            .call(yAxis)

        

        svg.selectAll('rect')
            .data(monthlyVariance)
            .enter()
            .append('rect')
            .attr('x', (d, i) => barWidth * (i/12))
            .attr('y', (d) => barHeight * d.month)
            .attr('height', barHeight)
            .attr('width', barWidth)
            .attr('class', 'cell')
            .attr('data-month', (d) => d.month)
            .attr('data-year', (d) => d.year)
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
            


})