<template>
  <div class="pie">
    <n-space class="mb_2" justify="start" align="center">
      <span class="pie_title">{{ getChartName(chartId) }}</span>
    </n-space>
      <n-empty v-show="showEmpty" description="無資料">
      </n-empty>
    <div class="pie_chart">
      <div :id="chartId"></div>
    </div>
    <n-grid cols="1 150:2 250:3">
      <n-grid-item v-for="(item, index) in data" :key="index">
        <n-space justify="start" align="center">
          <div class="rect" :style="{ background: color(index as any) }"></div>
          <span>{{ item.label }}</span>
        </n-space>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import { getChartName } from './CorrespondingCategoryName'

interface DataItem {
  label: string
  value: number
}

const props = withDefaults(defineProps<{
  data: DataItem[]
  chartId: string
  size?: number
}>(),{
  size: 250
})

const showEmpty = computed(() => props.data.length === 0);

const RADIUS = props.size / 3;
const COLOR_SCHEME = d3.schemeCategory10

function createColorScale() {
  return d3.scaleOrdinal(COLOR_SCHEME)
}

function createArcGenerator(radius: number) {
  return d3.arc().innerRadius(0).outerRadius(radius)
}

function createPieGenerator() {
  return d3.pie<DataItem>().value((d) => d.value)
}

const color = createColorScale()
const arc = createArcGenerator(RADIUS)
const pie = createPieGenerator()

function createPieChart() {
  const svgChart = d3.select(`#${props.chartId}`)
  // 清除原有的 SVG
  svgChart.select('svg').remove()

  const svg = svgChart
    .append('svg')
    .attr('width', props.size)
    .attr('height', props.size)
    .append('g')
    .attr('transform', `translate(${props.size / 2},${props.size / 2})`)
  const pieData = pie(props.data)
  const arcs = svg.selectAll('arc').data(pieData).enter().append('g')

  arcs
    .append('path')
    .attr('d', (d: any) => arc(d))
    .attr('stroke', 'white')
    .attr('stroke-width', 3)
    .attr('fill', (d, i) => color(i as any))
  var pos = d3
    .arc()
    .innerRadius(RADIUS + 20)
    .outerRadius(RADIUS + 20)

  arcs
    .append('text')
    .attr('transform', (d: any) => `translate(${pos.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .text((d: any) => `${d.data.value}%`)
}

onMounted(() => {
  createPieChart()
})

watch(
  () => props.data,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      createPieChart()
    }
  }
)
</script>

<style scoped lang="scss">
.rect {
  height: 8px;
  width: 8px;
  margin-left: 4px;
}

.pie {
  width: 100%;
  height: 100%;
  padding: 12px;

  :deep(.pie_title) {
    font-size: 1.17em; /* H3 的大小 */
    color: #333; /* 文字顏色 */
    transition: color 0.3s ease; /* 顏色變化的過渡效果 */
  }

  &:hover{
    :deep(.pie_title) {
      color: #007BFF; /* 當滑鼠懸停在 .pie 上時，.pie_title 的文字顏色 */
    }
  }

  &_chart {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 5px;
  }
}
</style>
