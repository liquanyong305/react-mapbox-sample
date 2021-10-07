
import React, { useEffect, useCallback } from 'react'
import * as d3 from 'd3'
import { Types } from '~type/Types'
import LineChartDateBisectorHelper from './LineChartDateBisectorHelper'

const LineChartDateBisector = (props: ILineChartProps) => {
  const memoizedUpdateCallback = useCallback(() => {
    const scales = LineChartDateBisectorHelper.getScales(props.data, props.dimensions.boundedWidth, props.dimensions.boundedHeight, props.propertiesNames)
    const bounds = d3.select('#bounds')

    const helper = new LineChartDateBisectorHelper(props.propertiesNames)

    // draw chart
    const linesGenerator = d3
      .line()
      // @ts-ignore
      .x((d) => scales.xScale(helper.xAccessor(d)))
      // @ts-ignore
      .y((d) => scales.yScale(helper.yAccessor(d)))

    const areaGenerator = d3
      .area().curve(d3.curveLinear)
      // @ts-ignore
      .x((d) => scales.xScale(helper.xAccessor(d)))
      .y0(325)
      // @ts-ignore
      .y1((d) => scales.yScale(helper.yAccessor(d)))

    d3.select('#pathArea')
      .attr("fill", "#69b3a2")
      .attr("fill-opacity", .3)
      .attr("stroke", "none")// @ts-ignore
      .attr("d", areaGenerator(props.data))

    d3.select('#pathLine')
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 4)
      // @ts-ignore
      .attr('d', linesGenerator(props.data))

    // yAxis
    const yAxisGenerator = d3.axisLeft(scales.yScale).tickSizeInner(0);
    bounds
      .select('#y-axis')
      // @ts-ignore
      .call(yAxisGenerator)
      .attr('stroke', 'black')
      .style('opacity', 1)

    // xAxis
    const xAxisGenerator = d3.axisBottom(scales.xScale)
    bounds
      .select('#x-axis')
      // @ts-ignore
      .call(xAxisGenerator)
      .attr('stroke', 'black')
      .style('transform', `translateY(${props.dimensions.boundedHeight}px)`)

    // @ts-ignore
    const bisect = d3.bisector((d) => {
      // console.log('bisec:', d);
      // const currentDateSplit =  (d as {date: string}).date.split('T')[0].split('-');
      // const currentTimeSplit =  (d as {date: string}).date.split('T')[1].split(':');
      const dateC = new Date((d as {date: string}).date);
      const currentDate = {
        year: dateC.getFullYear(),
        month: dateC.getMonth()+1,
        day: dateC.getDay(),
        hour: dateC.getHours(),
        minute: dateC.getMinutes(),
      }
      // console.log('currentDate:', currentDate);
      return new Date(currentDate.year, currentDate.month, currentDate.day, currentDate.hour, currentDate.minute);
    })

    const focus = bounds
      .append('g')
      .append('circle')
      .style('fill', 'none')
      .attr('stroke', 'black')
      .attr('r', 4.5)
      .style('opacity', 0)

    const focusText = bounds
      .append('g')
      .append('text')
      .style('opacity', 0)
      .style('fill', 'black')
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle')

    bounds
      .append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', props.dimensions.width)
      .attr('height', props.dimensions.height)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

    bounds.append("line")
      .attr("x1",0) // x座標の始点
      .attr("x2",600) // x座標の終点
      .attr("y1",function() { return scales.yScale(5)}) // y座標の始点
      .attr("y2",function() { return scales.yScale(5)}) // y座標の終点
      .attr("stroke-width",1)　// 線の太さ
      .attr("stroke","green"); // 線の色

      bounds.append("line")
      .attr("x1",0) // x座標の始点
      .attr("x2",600) // x座標の終点
      .attr("y1",function() { return scales.yScale(6)}) // y座標の始点
      .attr("y2",function() { return scales.yScale(6)}) // y座標の終点
      .attr("stroke-width",1)　// 線の太さ
      .attr("stroke","#F9C270"); // 線の色

      bounds.append("line")
      .attr("x1",0) // x座標の始点
      .attr("x2",600) // x座標の終点
      .attr("y1",function() { return scales.yScale(7)}) // y座標の始点
      .attr("y2",function() { return scales.yScale(7)}) // y座標の終点
      .attr("stroke-width",1)　// 線の太さ
      .attr("stroke","red"); // 線の色

      bounds.select("#y-axis path").remove();
      bounds.select("#x-axis line");
      // bounds.append("text")
      // .attr("x", -20) // x座標
      // .attr("y", function() { return scales.yScale(0)}) // y座標
      // .text("0")  // プレーンテキスト


      // bounds.append("text")
      // .attr("x", -20) // x座標
      // .attr("y", function() { return scales.yScale(1)}) // y座標
      // .text("1")  // プレーンテキスト


      // bounds.append("text")
      // .attr("x", -20) // x座標
      // .attr("y", function() { return scales.yScale(2)}) // y座標
      // .text("2")  // プレーンテキスト


      // bounds.append("text")
      // .attr("x", -20) // x座標
      // .attr("y", function() { return scales.yScale(3)}) // y座標
      // .text("3")  // プレーンテキスト


      // bounds.append("text")
      // .attr("x", -20) // x座標
      // .attr("y", function() { return scales.yScale(4)}) // y座標
      // .text("4")  // プレーンテキスト


      // bounds.append("text")
      // .attr("x", -20) // x座標
      // .attr("y", function() { return scales.yScale(5)}) // y座標
      // .text("5")  // プレーンテキスト


      // bounds.append("text")
      // .attr("x", -20) // x座標
      // .attr("y", function() { return scales.yScale(6)}) // y座標
      // .text("6")  // プレーンテキスト


      // bounds.append("text")
      // .attr("x", -20) // x座標
      // .attr("y", function() { return scales.yScale(7)}) // y座標
      // .text("7")  // プレーンテキスト



    function mouseover() {
      focus.style('opacity', 1)
      focusText.style('opacity', 1)
    }

    function mousemove(event: React.MouseEvent) {
      const [x] = d3.pointer(event)
      const x0 = scales.xScale.invert(x);
      // console.log('currentTimeSplit:', x0);
      // const currentDateSplit = x0.toISOString().split('T')[0].split('-');
      // const currentTimeSplit = x0.toISOString().split('T')[1].split(':');
      // console.log('currentTimeSplit:', x0.toISOString(), currentTimeSplit);
      // const currentDate = {
      //   year: parseInt(currentDateSplit[0], 10),
      //   month: parseInt(currentDateSplit[1], 10),
      //   day: parseInt(currentDateSplit[2], 10),
      //   hour: parseInt(currentTimeSplit[0], 10),
      //   minute: parseInt(currentTimeSplit[1], 10),
      // }
      // console.log('currentplit:', currentDateSplit, x0.toISOString().split('T')[1]);
      const currentDate = {
        year: x0.getFullYear(),
        month: x0.getMonth()+1,
        day: x0.getDay(),
        hour: x0.getHours(),
        minute: x0.getMinutes(),
      }
      let selectedData = props.data[props.data.length - 1]
      // console.log('selectedData before:', currentDate, selectedData.date);
      const i = bisect.right( props.data, new Date(currentDate.year, currentDate.month, currentDate.day, currentDate.hour,currentDate.minute) )
      // console.log('iiiii:', i);
      if (i <= props.data.length - 1)
        selectedData = props.data[i]
      // console.log('selectedData:', selectedData.date);
      
      focus
        .attr('cx', scales.xScale(new Date(selectedData.date)))
        .attr('cy', scales.yScale(selectedData.value))
      focusText
        .html(`${  selectedData.date  }  <br/>  水位  ${  selectedData.value}`)
        .attr('x', scales.xScale(new Date(selectedData.date))+15)
        .attr('y', scales.yScale(selectedData.value))
    }
    function mouseout() {
      focus.style('opacity', 0)
      focusText.style('opacity', 0)
    }

  }, [props.data, props.dimensions, props.propertiesNames])

  useEffect(() => {
    memoizedUpdateCallback()
  }, [memoizedUpdateCallback, props.data])

  return (
    <div id="lineChartDateBisector">
      <svg id="wrapper" width={props.dimensions.width} height={props.dimensions.height}>
        <g id="bounds" style={{ transform: `translate(${props.dimensions.margin.left}px, ${props.dimensions.margin.top}px)` }}>
          <path id="pathLine" />
          <path id="pathArea" />
          <g id="x-axis" />
          <g id="y-axis" />
        </g>
      </svg>
    </div>
  )
}

interface ILineChartProps {
  dimensions: Types.Dimensions
  data: Types.Data[]
  propertiesNames: string[]
}

export default LineChartDateBisector
