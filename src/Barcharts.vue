<template>
    <div>
        <div style="width: 1420px; margin: auto">
            <div style="display: grid; grid-template-columns: fit-content(355px) fit-content(355px) fit-content(355px) fit-content(355px); width: 100%;">
                <Barchart id="goalStat" :data="goalStat" title="Goals scored" statName="Goals"/>
                <Barchart id="expectedGoals" :data="expectedGoalsStat" title="Expected goals" statName="Expected goals"/>
                <Barchart id="goalPer90MinutesStat" :data="goalsPer90MinutesStat" title="Goals scored per 90 minutes of playtime" statName="Goals per 90 minutes"/>
                <Barchart id="shots" :data="shotsStat" title="Shots" statName="Shots"/>
                <Barchart id="shotsOnTarget" :data="shotsOnTargetStat" title="Shots on target" statName="Shots on target"/>
                <Barchart id="shotsOnTargetPercentage" :data="shotsOnTargetPercentageStat" title="Percentage of shots on target" statName="Percentage of shots per target"/>
                <Barchart id="goalsPerShotOnTarget" :data="goalsPerShotOnTargetStat" title="Goals per shot on target" statName="Goals per shot on target"/>
                <Barchart id="passingStat" :data="passingStat" title="Passes" statName="Passes"/>
                <Barchart id="gamesStarted" :data="matchPlayedStat" title="Games played" statName="Games played"/>
                <Barchart id="minutesPlayed" :data="minutesPlayedStat" title="Minutes played" statName="Minutes played"/>
                <Barchart id="yellowCards" :data="yellowCardsStat" title="Yellow cards received" statName="Yellow cards"/>
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
        function highlightPlayer(playerName) {
            d3.selectAll(`#bar-${playerName.replace(/\s/g,'')}`)
                .transition()
                .duration(300)
                .attr('stroke', 'black')
                .attr('stroke-width', '2')
                .attr('opacity', 1.0)
        }

        function removeHighlight(playerName) {
            d3.selectAll(`#bar-${playerName.replace(/\s/g,'')}`)
                .transition()
                .duration(300)
                .attr('stroke', 'transparent')
                .attr('stroke-width', '0')
                .attr('opacity', 0.7)
        }

        function toggleColor(playerName, scale) {
            const currentColor = d3.selectAll(`#bar-${playerName.replace(/\s/g,'')}`).attr('fill');
            const newColor = currentColor === 'rgb(0, 0, 0)' ? scale(playerName) : 'rgb(0, 0, 0)';
            d3.selectAll(`#bar-${playerName.replace(/\s/g,'')}`)
                .transition()
                .duration(300)
                .attr('fill', newColor);
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
                .style('opacity', 0.7)
                .on('mouseover', (event, element) => highlightPlayer(element.PlayerName))
                .on('mouseout', (event, element) => removeHighlight(element.PlayerName))
                .on('click', (event, element) => toggleColor(element.PlayerName, scale));
                

            divs.append('div')
                .style('width', '20px')
                .style('height', '20px')
                .style('border-radius', '10px')
                .style('margin-right', '3px')
                .style('background-color', element => scale(element.PlayerName))

            divs.append('div')
                .style('cursor', 'default')
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

            // Barcharts
            goalStat.value = getStat(liguaStats, 'Goals');
            goalsPer90MinutesStat.value = getStat(liguaStats, 'GoalsPer90Minutes');
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
