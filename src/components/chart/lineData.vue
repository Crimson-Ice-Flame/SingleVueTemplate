<template>
  <div :id="chartId"></div>
  <div v-if="haveData" class="legend-list">
    <template v-for="(item, index) in Object.keys(data[0])" :key="index">
      <div v-if="typeof data[0][item] === 'number'" class="legend-container">
        <span :class="`rect${index}`"></span>
        <span class="content">{{ getChartName(item) }}</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import * as d3 from 'd3'
import { getChartName } from './CorrespondingCategoryName'

interface DataPoint {
  [key: string]: string | number
}

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<DataPoint[]>,
      required: true
    },
    chartId: {
      type: String,
      default: 'line-chart'
    }
  },
  setup(props) {
    const drawLineChart = () => {
      const parent = d3.select(`#${props.chartId}`)
      // 取得父元素的寬高
      const width = (parent.node() as Element).getBoundingClientRect().width
      const height = 250
      const MARGIN = { top: 20, right: 20, bottom: 20, left: 20 }
      // 設定內部寬
      const INNER_WIDTH = width - MARGIN.left - MARGIN.right
      // 設定內部高
      const INNER_HEIGHT = height - MARGIN.top - MARGIN.bottom

      // 清除原有的 SVG
      parent.select('svg').remove()
      const svg = parent
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', width)
        .attr('height', height)

      // 創建了一個SVG元素的群組（group），並將其添加到SVG畫布上。這個群組元素可以用來組織和管理其他SVG元素，例如圖形、文字等。
      // append('g')表示在SVG畫布上添加一個群組元素。並設置了群組元素的transform屬性，使用translate函數將群組元素在畫布上的位置進行平移。
      const group = svg.append('g').attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)

      // 取得資料物件的所有 key，並只要是數值的 key，取得最大值艮domain使用
      let dataAnalyticalCategory = '';
      const keys = Object.keys(props.data[0]).filter(
        (key, index) => {
          if(index === 0){ dataAnalyticalCategory = key}

          return typeof props.data[0][key] === 'number'
        }
      )

      // d3函式庫中的extent方法，該方法用於計算數據集合的最小值和最大值。計算props.data數組中的年份的最小值和最大值。
      // const dateRange = d3.extent(props.data.map((d) => new Date(d[dataAnalyticalCategory] as string)))
      const dateRange = props.data.map((d) => d[dataAnalyticalCategory]);

      // 創建一個時間比例尺
      const xScale = d3
        .scalePoint()
        .domain(dateRange.map(String)) // Convert dateRange array to an iterable of strings
        .range([MARGIN.left + MARGIN.right, INNER_WIDTH - MARGIN.left]) // 設定輸出範圍為圖表的寬度

      
      const maxValues = keys.map((key) => d3.max(props.data.map((d) => d[key] as number)))
      const maxValue = d3.max(maxValues.map((value) => Number(value))) as number

      // 折現刻度最多13個，如果最大值小於13，則要補足最高克度13

      // 創建一個線性比例尺
      const yScale = d3
        .scaleLinear() // 線性比例尺
        .domain([0, maxValue < 13 ? 13 : maxValue]) // 輸入範圍為 0 到最大值
        .range([INNER_HEIGHT, 0]) // 輸出範圍為內部高度到 0
        .nice() // 使比例尺的範圍變得更加整潔

        const xScaleCreate = (d: DataPoint) => xScale(String(d[dataAnalyticalCategory]));
      // 創建一個線生成器
      const createLine = (valueKey: keyof DataPoint) =>
        d3
          .line<DataPoint>() // 線生成器
          .x((d) => xScaleCreate(d)!) // x 值為年份
          .y((d) => yScale(Number(d[valueKey]))) // y 值為對應的數值
      
      // 創建一個文本生成器
      const createText = (valueKey: keyof DataPoint) => (d: DataPoint) => {
       
        let xScaleSet = xScaleCreate(d)
        if(xScaleSet !== undefined) {
          group
            .append('text') // 添加文本
            .attr('x', xScaleSet) // x 位置為年份
            .attr('y', yScale(Number(d[valueKey]))) // y 位置為對應的數值
            .attr('transform', 'translate(-5, -5)') // 進行一個小的位移，使文本不會與線重疊
            .text(d[valueKey]) // 文本內容為對應的數值
        }
      }
      
      // 對每一個鍵值創建一條線和對應的文本
      keys.forEach((key) => {
        props.data.forEach((d) => {
          createText(key)(d) // 創建文本
        })
        
        group
          .append('path') // 添加路徑
          .attr('d', createLine(key)(props.data)) // 路徑為對應的線
          .attr('fill', 'none') // 無填充色
          .attr('stroke-width', 2) // 線寬為 2
          .attr('stroke', key === keys[0] ? '#1f77b4' : '#2ca02c') // 線色為藍色或綠色
      })

      // 添加 x 軸
      group
        .append('g')
        .attr('transform', `translate(0, ${INNER_HEIGHT})`) // 將 x 軸移動到底部
        .call(d3.axisBottom(xScale)) // 使用時間比例尺

      // 添加 y 軸
      group.append('g').call(d3.axisLeft(yScale).tickSize(-INNER_WIDTH).tickPadding(10)) // 使用線性比例尺，刻度長度為內部寬度，刻度與軸的距離為 10
    }

    const haveData = computed(() => props.data !== undefined && props.data !== null && props.data.length > 0)


    onMounted(() => {
      if (haveData.value) {
        console.log(haveData.value);
        drawLineChart()
      }
    })

    watch(
      () => props.data,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          drawLineChart()
        }
      }
    )

    return {
      haveData,
      getChartName
    }
  }
})
</script>

<style scoped ls="scss">
.rect1 {
  margin-right: 5px;
  height: 12px;
  width: 12px;
  background: #1f77b4;
}
.rect2 {
  margin-right: 5px;
  height: 12px;
  width: 12px;
  background: #2ca02c;
}

.legend-container,
.legend-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 5px;
}
</style>
