<template>
    <div class="container">
        <!-- <h1>
            Titre
        </h1> -->
        <div class="text">
            <p>
                Introduce the context leading up to this analysis.
            </p>
            <p>
                Introduce what will be seen in the viz.
            </p>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'IntroPage',
});

</script>

<style>
    .container {
        margin: auto;
        text-align: center;
        font-family: 'Roboto';
        font-weight: 400;
        width: 50%;
        color: white;
    }

    .container h1 {
        font-size: 64px;
    }
    
    .text {
        font-size: 24px;
    }
</style>
