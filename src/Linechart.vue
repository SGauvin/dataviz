<template>
    <div class="linechart-container">
        <div class="linechart-viz" id="linechart-content" style="font-family: 'Roboto', sans-serif"></div>
        <div class="statSelector">
            <div class="list-item" :class="{selected : currentStatName === 'Goals'}" @click="updateData('Goals')">Goals</div>
            <div class="list-item" :class="{selected : currentStatName === 'MinutesPlayed'}" @click="updateData('MinutesPlayed')">Minutes Played</div>
            <div class="list-item" :class="{selected : currentStatName === 'Assists'}" @click="updateData('Assists')">Assists</div>
            <div class="list-item" :class="{selected : currentStatName === 'Shots'}" @click="updateData('Shots')">Shots</div>
            <div class="list-item" :class="{selected : currentStatName === 'ShotsOnTarget'}" @click="updateData('ShotsOnTarget')">Shots on Target</div>
            <div class="list-item" :class="{selected : currentStatName === 'YellowCards'}" @click="updateData('YellowCards')">Yellow Cards</div>
            <div class="list-item" :class="{selected : currentStatName === 'RedCards'}" @click="updateData('RedCards')">Red Cards</div>
            <div class="list-item" :class="{selected : currentStatName === 'GoalsPer90Minutes'}" @click="updateData('GoalsPer90Minutes')">Goals per 90 minutes</div>
            <div class="list-item" :class="{selected : currentStatName === 'AssistsPer90Minutes'}" @click="updateData('AssistsPer90Minutes')">Assists per 90 minutes</div>
            <div class="list-item" :class="{selected : currentStatName === 'ShotsOnTargetPer90Minutes'}" @click="updateData('ShotsOnTargetPer90Minutes')">Shots on target per 90 minutes</div>
        </div>
        <div class="linechart-legend">
            <div class="linechart-legend-item-container" @mouseenter="highlightPlayer('benzema')" @mouseout="removeHighlight('benzema')">
                <div class = "linechart-legend-color" style="background-color: blue;"></div>
                <div class="linechart-player-name" id="benzema-linechart-legend">
                    Karim Benzema
                </div>
            </div>
            <div class="linechart-legend-item-container" @mouseenter="highlightPlayer('giroud')" @mouseout="removeHighlight('giroud')">
                <div class = "linechart-legend-color" style="background-color: red;"></div>
                <div class="linechart-player-name" id="giroud-linechart-legend">
                    Olivier Giroud
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { getBenzemaHistoricalStats, getGiroudHistoricalStats } from './preprocess.js';
export default defineComponent({
    name: 'Linechart',
    setup() {
        const size = { width: 920, height: 500 };
        const margin = { left: 40, right: 10, top: 10, bottom: 60 };
        const transitionTime = 400;

        let svgRoot;
        let toolTip;
        let benzemaData = [];
        let giroudData = [];
        let xScale;
        let yScale;
        let xAxis;
        let yAxis;
        let currentStatName = ref("Goals");

        function createSvg() {
            d3.select('#linechart-content')
                    .append('svg')
                    .attr('width', size.width + margin.left + margin.right)
                    .attr('height', size.height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`)
                    .attr('id', 'content-g');
        }

        function rotateLabels(svgRoot) {
            svgRoot.selectAll('.tick')
                .select('text')
                .attr('transform', 'rotate(45)')
                .attr('font-size', '12px')
                .style('text-anchor', 'start');
        }

        function drawPath(svgRoot, data, yVar, color, playerName) {
            svgRoot.select('#content-g')
                .append('path')
                .attr('class', `dataLine-${playerName}`)
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('d', d3.line().x(element => xScale(element.Season)).y(element => yScale(element[yVar])));
        }

        function updatePathAndCircles(data, playerName, statName) {
            const u = svgRoot.selectAll(`.dataLine-${playerName}`)
                .data([data], (element) => element.Season);

            u.enter().append('path')
                .merge(u)
                .transition()
                .duration(transitionTime)
                .attr('d', d3.line().x(element => xScale(element.Season)).y(element => yScale(element[statName])));

            svgRoot.select('#content-g')
                .selectAll(`.circles-${playerName}`)
                .data(data)
                .transition()
                .duration(transitionTime)
                .attr('cy', element => yScale(element[statName]))
                // .on('mouseover', (event, value) => toolTip.show(value, event.target))
                // .on('mouseout', (event, value) => toolTip.hide(value, event.target));
        }

        function createXScale(benzemaData, giroudData, graphDimensions) {
            const range = [];
            const domain = Array.from(new Set(benzemaData.map(element => element.Season).concat(giroudData.map(element => element.Season)))).sort();
            for (let i = 0; i < domain.length; i++) {
                range.push(i * graphDimensions.width / domain.length)
            }

            xScale = d3.scaleOrdinal();
            xScale.domain(domain).range(range);
        }

        function createYScale(benzemaData, giroudData, graphDimensions, yVar) {
            const max = Math.max(...benzemaData.map(element => element[yVar]), ...giroudData.map(element => element[yVar]));
            yScale = d3.scaleLinear();
            yScale.domain([0, max]).range([graphDimensions.height, 0]);
        }

        function drawCircles(svgRoot, data, yVar, color, playerName, toolTip) {
            svgRoot.select('#content-g')
                .selectAll(`.circles-${playerName}`)
                .data(data)
                .join('circle')
                .attr('class', `circles-${playerName}`)
                .attr('fill', color)
                .attr('stroke', 'none')
                .attr('cx', element => xScale(element.Season))
                .attr('cy', element => yScale(element[yVar]))
                .attr('r', 5)
                .on('mouseover', (event, value) => toolTip.show(value, event.target))
                .on('mouseout', (event, value) => toolTip.hide(value, event.target));
        }

        function addAxesGroups(svgRoot, graphDimensions) {
            svgRoot.select('#content-g')
                .append('g')
                .attr('class', 'xAxis')
                .attr('transform', `translate(0 ${graphDimensions.height})`);

            svgRoot.select('#content-g')
                .append('g')
                .attr('class', 'yAxis');
        }

        function drawXAxis(svgRoot, graphDimensions) {
            xAxis = d3.axisBottom(xScale);
            svgRoot.select('.xAxis').call(xAxis);
        }

        function drawYAxis(svgRoot, transitionTime) {
            yAxis = d3.axisLeft(yScale).ticks(5)
            svgRoot.select('.yAxis').transition().duration(transitionTime).call(yAxis);
        }

        function updateData(statName) {
            createYScale(benzemaData, giroudData, size, statName);
            drawYAxis(svgRoot, transitionTime);
            updatePathAndCircles(benzemaData, 'benzema', statName);
            updatePathAndCircles(giroudData, 'giroud', statName);
            currentStatName.value = statName;
        }

        function highlightPlayer(playerName) {
            d3.selectAll(`.dataLine-${playerName}`)
                .transition()
                .duration(300)
                .attr('stroke-width', 4)

            d3.selectAll(`.circles-${playerName}`)
                .transition()
                .duration(300)
                .attr('r', 8)

            d3.select(`#${playerName}-linechart-legend`)
                .transition()
                .duration(300)
                .style('margin-top', '2px')
                .style('font-size', '22px');
        }

        function removeHighlight(playerName) {
            d3.selectAll(`.dataLine-${playerName}`)
                .transition()
                .duration(300)
                .attr('stroke-width', 1.5)

            d3.selectAll(`.circles-${playerName}`)
                .transition()
                .duration(300)
                .attr('r', 5)

            d3.select(`#${playerName}-linechart-legend`)
                .transition()
                .duration(300)
                .style('margin-top', '3px')
                .style('font-size', '20px');
        }

        function getTooltipContent(element) {
            return `<div style="font-family: 'Roboto', sans-serif">
            <span>${element[currentStatName.value]}</span>`;
        }

        onMounted(async () => {
            createSvg();
            svgRoot = d3.select(`#linechart-content`);
            toolTip = d3Tip().attr('class', 'd3-tip').html(getTooltipContent);
            svgRoot.call(toolTip);

            benzemaData = await getBenzemaHistoricalStats();
            giroudData = await getGiroudHistoricalStats();
            // console.log(benzemaData)
            // console.log(giroudData)
            createXScale(benzemaData, giroudData, size);
            createYScale(benzemaData, giroudData, size, currentStatName.value);

            addAxesGroups(svgRoot, size);
            drawXAxis(svgRoot, size);
            rotateLabels(svgRoot);
            drawYAxis(svgRoot, size, 0);

            drawPath(svgRoot, giroudData, currentStatName.value, 'red', 'giroud');
            drawCircles(svgRoot, giroudData, currentStatName.value, 'red', 'giroud', toolTip);

            drawPath(svgRoot, benzemaData, currentStatName.value, 'blue', 'benzema');
            drawCircles(svgRoot, benzemaData, currentStatName.value, 'blue', 'benzema', toolTip);
        });

        return {
            updateData,
            highlightPlayer,
            removeHighlight,
            currentStatName,
        };
    },
})
</script>

<style>
    .linechart-container {
        font-family: 'Roboto';
        display: grid;
        grid-template-areas:
            "linechart linechart linechart linechart selector selector"
            "linechart linechart linechart linechart selector selector"
            "linechart linechart linechart linechart selector   selector"
            "linechart linechart linechart linechart legend   legend";
        width: 1300px;
        margin: auto;
    }

    .linechart-viz {
        grid-area: linechart;
    }

    .statSelector {
        grid-area: selector;
        font-size: 20px;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
        width: 330px;
    }

    .linechart-legend {
        grid-area: legend;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    .list-item {
        cursor: pointer;
        transition: font-size 300ms;
        height: 29px;
    }

    .selected {
        font-size: 24px;
        font-weight: bold;
    }

    .linechart-player-name {
        font-size: 20px;
        /* transition: font-size 300ms;
        transition: margin-top 300ms; */
        margin-top: 3px;
        margin-left: 10px;
        pointer-events: none;
    }

    .linechart-legend-color {
        width: 30px; height:30px;
        border-radius: 15px;
        pointer-events: none;
    }

    .linechart-legend-item-container {
        display: flex;
        cursor: default;
    }

</style>
