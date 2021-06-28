<template>
    <div>
        <div style="width: 1420px; margin: auto">
            <div style="display: grid; grid-template-columns: fit-content(355px) fit-content(355px) fit-content(355px) fit-content(355px); width: 100%;">
                <Barchart id="goalStat" :data="goalStat" title="Buts marqués" statName="Nombre de buts"/>
                <Barchart id="expectedGoals" :data="expectedGoalsStat" title="Buts attendus" statName="Nombre de buts attendus"/>
                <Barchart id="goalPer90MinutesStat" :data="goalsPer90MinutesStat" title="Buts par 90 minutes" statName="Buts par 90 minutes"/>
                <Barchart id="goalsPerShotOnTarget" :data="goalsPerShotOnTargetStat" title="Buts par tir cadré" statName="But par tir cadré"/>
                <Barchart id="shots" :data="shotsStat" title="Tirs" statName="Nombre de tirs"/>
                <Barchart id="shotsOnTarget" :data="shotsOnTargetStat" title="Tirs cadrés" statName="Nombre de tirs cadrés"/>
                <Barchart id="shotsOnTargetPercentage" :data="shotsOnTargetPercentageStat" title="Pourcentage de tirs cardés" statName="Poucentage de tirs cadrés"/>
                <Barchart id="passingStat" :data="passingStat" title="Passes décisives" statName="Passes"/>
                <Barchart id="passCompleted" :data="passCompletedStat" title="Passes complétées" statName="Passes complétées"/>
                <Barchart id="gamesStarted" :data="matchPlayedStat" title="Parties jouées" statName="Parties jouées"/>
                <Barchart id="minutesPlayed" :data="minutesPlayedStat" title="Minutes jouées" statName="Minutes jouées"/>
                <Barchart id="yellowCards" :data="yellowCardsStat" title="Cartons jaunes recu" statName="Cartons jaunes"/>
            </div>
            <div class="barchart-legend" style="display:flex; justify-content: space-between; padding-left: 40px; padding-right:15px"></div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import Barchart from './components/Barchart.vue';

import { getLiguaStats } from './preprocess.js'
import * as d3 from 'd3';

export default defineComponent({
    components: { Barchart },
    name: 'Barcharts',
    setup() {
        const transitionTime = 300;
        const opacityValue = 0.80;

        function highlightPlayer(playerName) {
            const selectorName = playerName.replace(/\s/g,'');

            d3.selectAll(`#bar-${selectorName}`)
                .transition(`transition-highlight-${playerName}`)
                .duration(transitionTime)
                .attr('stroke', 'black')
                .attr('stroke-width', '2')
                .attr('opacity', 1)

            d3.select(`#legend-bar-${selectorName}`)
                .transition(`transition-highlight-${playerName}`)
                .duration(transitionTime)
                .style('opacity', 1);
        }

        function removeHighlight(playerName) {
            const selectorName = playerName.replace(/\s/g,'');

            d3.selectAll(`#bar-${selectorName}`)
                .transition(`transition-highlight-${playerName}`)
                .duration(transitionTime)
                .attr('stroke', 'transparent')
                .attr('stroke-width', '0')
                .attr('opacity', opacityValue)

            d3.select(`#legend-bar-${selectorName}`)
                .transition(`transition-highlight-${playerName}`)
                .duration(transitionTime)
                .style('opacity', opacityValue);
        }

        function toggleColor(playerName, scale) {
            const selectorName = playerName.replace(/\s/g,'');

            const currentColor = d3.selectAll(`#bar-${selectorName}`).attr('fill');
            const newColor = currentColor === 'rgb(0, 0, 0)' ? scale(playerName) : 'rgb(0, 0, 0)';
            d3.selectAll(`#bar-${selectorName}`)
                .transition(`transition-${selectorName}`)
                .duration(transitionTime)
                .attr('fill', newColor);

            d3.select(`#legend-bar-${selectorName}`)
                .transition(`transition-${selectorName}`)
                .duration(transitionTime)
                .style('background-color', newColor);
        }

        function createLegend(data) {
            const scale = d3.scaleOrdinal();
            scale.domain(data.map(element => element.PlayerName)).range(d3.schemeCategory10);

            const divs = d3.select('.barchart-legend')
                .selectAll('.names')
                .data(data)
                .join('div')
                .style('font-family', 'Roboto')
                .style('display', 'flex')
                .style('cursor', 'pointer')
                .on('mouseover', (event, element) => highlightPlayer(element.PlayerName))
                .on('mouseout', (event, element) => removeHighlight(element.PlayerName))
                .on('click', (event, element) => toggleColor(element.PlayerName, scale));
                
            divs.append('div')
                .attr('id', element => `legend-bar-${element.PlayerName.replace(/\s/g,'')}`)
                .style('width', '20px')
                .style('height', '20px')
                .style('border-radius', '10px')
                .style('margin-right', '3px')
                .style('background-color', element => element.PlayerName === 'Karim Benzema' ? scale(element.PlayerName) : 'rgb(0, 0, 0)')
                .style('opacity', opacityValue)

            divs.append('div')
                .text(element => element.PlayerName)
        }

        function getStat(data, statName) {
            const stat = [];
            for(const element of data) {
                stat.push({ x: element.PlayerName, y: element[statName] });
            }
            return stat;
        }

        let goalStat = ref([]);
        let goalsPer90MinutesStat = ref([]);
        let passCompletedStat = ref([]);
        let passingStat = ref([]);
        let matchPlayedStat = ref([]);
        let expectedGoalsStat = ref([]);
        let yellowCardsStat = ref([]);
        let shotsStat = ref([]);
        let shotsOnTargetStat = ref([]);
        let shotsOnTargetPercentageStat = ref([]);
        let goalsPerShotOnTargetStat = ref([]);
        let minutesPlayedStat = ref([]);

        onMounted(async () => {
            const liguaStats = await getLiguaStats();

            createLegend(liguaStats);

            // Barchart stats
            goalStat.value = getStat(liguaStats, 'Goals');
            goalsPer90MinutesStat.value = getStat(liguaStats, 'GoalsPer90Minutes');
            passCompletedStat.value = getStat(liguaStats, 'PassCompleted');
            passingStat.value = getStat(liguaStats, 'Assists');
            matchPlayedStat.value = getStat(liguaStats, 'MatchPlayed');
            expectedGoalsStat.value = getStat(liguaStats, 'ExpectedGoals');
            yellowCardsStat.value = getStat(liguaStats, 'YellowCards');
            shotsStat.value = getStat(liguaStats, 'Shots');
            shotsOnTargetStat.value = getStat(liguaStats, 'ShotsOnTarget');
            shotsOnTargetPercentageStat.value = getStat(liguaStats, 'ShotsOnTargetPercentage');
            goalsPerShotOnTargetStat.value = getStat(liguaStats, 'GoalsPerShotOnTarget');
            minutesPlayedStat.value = getStat(liguaStats, 'MinutesPlayed');
        });

        return {
            goalStat,
            goalsPer90MinutesStat,
            passingStat,
            matchPlayedStat,
            expectedGoalsStat,
            yellowCardsStat,
            passCompletedStat,
            shotsStat,
            shotsOnTargetStat,
            shotsOnTargetPercentageStat,
            goalsPerShotOnTargetStat,
            minutesPlayedStat,
        };
    },
});

</script>

<style>

</style>
