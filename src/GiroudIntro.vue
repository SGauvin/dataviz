<template>
    <h1 class="h1-ligua-intro">
        La Ligua
    </h1>
</template>

<script>
import { defineComponent} from 'vue'

export default defineComponent({
    name: 'GiroudIntro',
});

</script>

<style>
    .h1-ligua-intro {
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
