<template>
    <h1 class="h1-front-page">
        Benzema is back.
    </h1>
</template>

<script>
import { defineComponent} from 'vue'

export default defineComponent({
    name: 'FrontPage',
});

</script>

<style>
    .h1-front-page {
        font-family: 'Roboto';
        color: white;
        margin: 0;
        padding: 0;
        top: 90%;
        left: 5%;
		transform: translateY(-50%);
		position: relative;
        font-size: 8em;
    }
    
</style>
