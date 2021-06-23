<template>
    <div :id="props.id" style="font-family: 'Roboto', sans-serif"></div>
</template>

<script>
import { defineComponent, watch } from 'vue'
import * as d3 from 'd3'
import d3Tip from 'd3-tip'

export default defineComponent({
    props: {
        data: Array,
        title: String,
        statName: String,
        id: String
    },
    setup(props) {
        const size = { width: 300, height: 130 };
        const margin = { left: 40, right: 15, top: 30, bottom: 90 };

        function createSvg() {
            d3.select(`#${props.id}`)
                .append('svg')
                .attr('width', size.width + margin.left + margin.right)
                .attr('height', size.height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .attr('id', 'content-g');
        }

        function createRectangles(data, xScale, yScale, colorScale, toolTip, graphDimensions) {
            d3.select(`#${props.id}`)
                .select('#content-g')
                .selectAll('.bars')
                .data(data)
                .join('rect')
                .attr('fill', element => element.x === 'Karim Benzema' ? colorScale(element.x) : 'rgb(0, 0, 0)')
                .attr('width', xScale.bandwidth())
                .attr('height', element => graphDimensions.height - yScale(+element.y))
                .attr('opacity', 0.8)
                .attr('x', element => xScale(element.x))
                .attr('y', element => yScale(element.y))
                .attr('stroke', 'transparent')
                .attr('stroke-width', '0')
                .attr('id', element => `bar-${element.x.replace(/\s/g,'')}`)
                .on('mouseover', (event, value) => {
                    toolTip.show(value, event.target);
                    d3.select(`#${props.id}`)
                        .select('svg')
                        .select(`#bar-${value.x.replace(/\s/g,'')}`)
                        .transition(`transition-bar-hover-${value.x.replace(/\s/g,'')}`)
                        .duration(300)
                        .attr('opacity', 1)
                        .attr('stroke-width', 2)
                        .attr('stroke', 'black')
                })
                .on('mouseout', (event, value) => {
                    toolTip.hide(value, event.target);
                    d3.select(`#${props.id}`)
                        .select('svg')
                        .select(`#bar-${value.x.replace(/\s/g,'')}`)
                        .transition(`transition-bar-hover-${value.x.replace(/\s/g,'')}`)
                        .duration(300)
                        .attr('opacity', 0.8)
                        .attr('stroke-width', 0)
                        .attr('stroke', 'transparent')
                })
        }

        function createTitle(svgRoot) {
            const text =
                svgRoot.select('#content-g')
                    .append('text')
                    .text(props.title)
                    .attr('fill', 'black')
                    .attr('font-size', '18px')

            const textRect = text.node().getBoundingClientRect()
            text.attr('x', (size.width - textRect.width) / 2).attr('y', -15);
        }

        function rotateLabels(svgRoot) {
            svgRoot.selectAll('.tick')
                .select('text')
                .attr('transform', 'rotate(45)')
                .attr('font-size', '12px')
                .style('text-anchor', 'start');
        }

        function createXScale(data, graphDimensions) {
            const scale = d3.scaleBand().padding(0.25);
            scale.domain(data.map(element => element.x)).range([0, graphDimensions.width]);
            return scale;
        }

        function createYScale(data, graphDimensions) {
            const scale = d3.scaleLinear();
            const maxY = Math.max(...data.map(element => element.y));
            scale.domain([0, maxY]).range([graphDimensions.height, 0]);
            return scale;
        }

        function createColorScale(data) {
            const scale = d3.scaleOrdinal();
            scale.domain(data.map(element => element.x)).range(d3.schemeCategory10);
            return scale;
        }

        function getTooltipContent(element) {
            return `<div style="font-family: 'Roboto', sans-serif">
            <span>${element.x}<br>
            ${props.statName}: ${element.y}</span>
            </div>`
        }

        function drawXAxis(xScale, svgRoot, graphDimensions) {
            svgRoot.select('#content-g')
                .append('g')
                .attr('class', 'x.axis')
                .attr('transform', `translate(0 ${graphDimensions.height})`)
                .call(d3.axisBottom(xScale));
        }

        function drawYAxis(yScale, svgRoot, graphDimensions) {
            svgRoot.select('#content-g')
                .append('g')
                .attr('class', 'y.axis')
                .call(d3.axisLeft(yScale).ticks(5))
        }

        watch(() => props.data, () => {
            const xScale = createXScale(props.data, size);
            const yScale = createYScale(props.data, size);
            const colorScale = createColorScale(props.data);

            createSvg();
            const svg = d3.select(`#${props.id}`).select('svg');
            const tooltip = d3Tip().attr('class', 'd3-tip').html(getTooltipContent);
            svg.call(tooltip);

            createRectangles(props.data, xScale, yScale, colorScale, tooltip, size);

            createTitle(svg);

            drawXAxis(xScale, svg, size);
            rotateLabels(svg);
            drawYAxis(yScale, svg, size);
        });

        return {
          props,
        }
    },
})
</script>

<style>
/* 

DO NOT MODIFY. 

Example CSS file provided with d3-tip library.
Credits : https://rawgit.com/Caged/d3-tip/master/examples/example-styles.css 

*/

.d3-tip {
    line-height: 1;
    font-weight: bold;
    padding: 12px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 2px;
    pointer-events: none;
  }
  
  /* Creates a small triangle extender for the tooltip */
  .d3-tip:after {
    box-sizing: border-box;
    font-size: 10px;
    width: 100%;
    line-height: 1;
    color: rgba(0, 0, 0, 0.8);
    position: absolute;
    pointer-events: none;
  }
  
  /* Northward tooltips */
  .d3-tip.n:after {
    content: "\25BC";
    margin: -1px 0 0 0;
    top: 100%;
    left: 0;
    text-align: center;
  }
  
  /* Eastward tooltips */
  .d3-tip.e:after {
    content: "\25C0";
    margin: -4px 0 0 0;
    top: 50%;
    left: -8px;
  }
  
  /* Southward tooltips */
  .d3-tip.s:after {
    content: "\25B2";
    margin: 0 0 1px 0;
    top: -8px;
    left: 0;
    text-align: center;
  }
  
  /* Westward tooltips */
  .d3-tip.w:after {
    content: "\25B6";
    margin: -4px 0 0 -1px;
    top: 50%;
    left: 100%;
  }
</style>
