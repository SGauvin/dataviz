import { createApp } from 'vue'
import FrontPage from './FrontPage.vue'
import IntroPage from './IntroPage.vue'
import LaLiguaIntro from './LaLiguaIntro.vue'
import Barcharts from './Barcharts.vue'
import Linechart from './Linechart.vue'

const frontPage = createApp(FrontPage);
frontPage.mount('#front-page');

const introPage = createApp(IntroPage);
introPage.mount('#intro-page');

const laLiguaIntro = createApp(LaLiguaIntro);
laLiguaIntro.mount('#ligua-intro');

const barcharts = createApp(Barcharts);
barcharts.mount('#barcharts');

const linechart = createApp(Linechart);
linechart.mount('#linechart');