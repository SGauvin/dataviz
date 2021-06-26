<template>
    <h1 class="h1-benzema-giroud">
        Benzema<br>vs<br>Giroud
    </h1>
</template>

<script>
import { defineComponent} from 'vue'

export default defineComponent({
    name: 'BenzemaGiroudIntro',
});

</script>

<style>
    .h1-benzema-giroud {
        font-family: 'Roboto';
        color: white;
        margin: 0;
        padding: 0;
        top: 90%;
        left: 2%;
		transform: translateY(-50%);
		position: relative;
        font-size: 8em;
    }
</style>
