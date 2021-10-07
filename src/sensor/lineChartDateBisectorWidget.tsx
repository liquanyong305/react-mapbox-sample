import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Types } from '~type/Types'
import useWindowDimensions from '~common/WindowDimensions'

import LineChartDateBisectorHelper from '~components/LineChartDateBisector/LineChartDateBisectorHelper'
import LineChartDateBisector from '~components/LineChartDateBisector/LineChartDateBisector'

interface Props {
  data: Types.Data[]
}

const LineChartDateBisectorWidget = (props: Props) => {
  const [data, setData] = useState<Types.Data[]>([{ date: '', value: 0 }])

  const { width, height } = useWindowDimensions()

  const dimensions = useRef() as { current: Types.Dimensions }
  dimensions.current = LineChartDateBisectorHelper.getDimensions(800 * 0.9, 400 * 0.9, 30, 50, 10, 20)

  // resize
  useEffect(() => {
    ((dimensions as unknown) as { current: Types.Dimensions }).current = LineChartDateBisectorHelper.getDimensions(width * 0.9, height * 0.9, 30, 50, 10, 20)
    // console.log(dimensions.current)
  }, [width, height])

  const loadData = () => {
    setData(props.data);
  }

  useEffect(() => {
    loadData();
  }, [props.data])

  return <>
    {data.length > 1
      ?
      <LineChartDateBisector
        dimensions={dimensions.current}
        data={data}
        propertiesNames={['date', 'value']}
      />
      :
      <>Loading</>}
    </>
}
export default LineChartDateBisectorWidget
