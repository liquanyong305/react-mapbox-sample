import React, { useEffect } from 'react'
import * as d3 from 'd3'
import { Types } from '~/type/Types'

const BasicLineChart = (props: IBasicLineChartProps) => {
  useEffect(() => {
    draw()
  })
  const dateParser = d3.timeParse("%Y-%m-%dT%H:%M");
  const draw = () => {
    const width = props.width - props.left - props.right
    const height = props.height - props.top - props.bottom

    const svg = d3
      .select('.basicLineChart')
      .append('svg')
      .attr('width', width + props.left + props.right)
      .attr('height', height + props.top + props.bottom)
      .append('g')
      .attr('transform', `translate(${props.left},${props.top})`)

    // d3.dsv(',', '', (d) => {
    //   const res = (d as unknown) as Types.Data
    //   const date = d3.timeParse('%Y-%m-%d')(res.date)
    //   return {
    //     date,
    //     value: res.value,
    //   }
    // }).then((data) => {
      // const dataSet:Types.Data[] = [{date: '2021/08/09', value: 1}, {date: '2021/08/10', value: 2}, {date: '2021/08/11', value: 2}, {date: '2021/08/12', value: 2}, {date: '2021/08/13', value: 2}, {date: '2021/08/14', value: 2}];
      const x = d3
        .scaleTime()
        .domain(
          d3.extent(props.data, (d) => {
            return dateParser(d.date);
          }) as [Date, Date]).range([0, width])
      console.log('d3.x:', x);

      svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x))

      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(props.data, (d) => {
            return Math.max(...props.data.map((dt) => ((dt as unknown) as Types.Data).value), 0)
          }),
        ] as number[])
        .range([height, 0])
      svg.append('g').call(d3.axisLeft(y))

      const mapped_data = props.data.map(function(d) {
        return {
          date: dateParser(d.date),
          value: d.value
        };
      });

      // // Add the line
      svg
        .append('path')
        .datum(mapped_data)
        .attr('fill', 'none')
        .attr('stroke', props.fill)
        .attr('stroke-width', 1.6)
        .attr(
          'd',
          // @ts-ignore
          d3
            .line()
            .x((d) => {
              return x(((d as unknown) as { date: number }).date)
            })
            .y((d) => {
              return y(((d as unknown) as Types.Data).value)
            })
        )

        // svg.append("path")
        // .datum(props.data)
        // .attr("fill", "none")
        // .attr("stroke", "steelblue")
        // .attr("stroke-width", 1.5)
        // .attr("d", d3.line()
        //   .x(function(d) { return x(d.date) })
        //   .y(function(d) { return y(d.value) })
        //   )

    // })
  }

  return <div className="basicLineChart" />
}

interface IBasicLineChartProps {
  data:Types.Data[]
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
  fill: string
}

export default BasicLineChart