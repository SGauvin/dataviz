<template>
    <div class="container">
        <!-- <h1>
            Titre
        </h1> -->
        <div class="text">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vehicula diam eget turpis volutpat, non ullamcorper odio porta. Ut pharetra lacus a lacus vehicula faucibus. Vivamus maximus ultricies nunc et bibendum. Vivamus lobortis rhoncus lorem ac dignissim. Ut lacinia nunc nibh, eget imperdiet tellus eleifend vitae. Curabitur et libero eu massa ullamcorper ultrices. Morbi vestibulum nibh ligula, molestie posuere augue sollicitudin in. Maecenas posuere elementum aliquam.
            </p>
            <p>
                Curabitur vitae enim sit amet diam cursus elementum. Curabitur fermentum risus sit amet rutrum dapibus. Pellentesque eu turpis nisl. Vivamus pharetra convallis justo. Phasellus dignissim ultricies tellus, sed iaculis lacus dictum at. Morbi ut interdum ipsum, et bibendum tortor. Pellentesque consequat aliquam dictum. Fusce tellus sapien, facilisis sed consectetur nec, pharetra id dui. Vestibulum erat eros, facilisis nec turpis sed, consequat pellentesque lorem. Morbi ut purus pulvinar, molestie felis a, varius sem. Integer dignissim maximus augue, eget hendrerit massa. Nunc eget metus interdum, convallis nisi sit amet, lacinia velit. Aenean lorem ante, pulvinar ac fermentum sollicitudin, facilisis eu turpis. Etiam tincidunt eleifend tellus, eu vestibulum nunc suscipit non.
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
