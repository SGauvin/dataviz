<template>
    <div class="container">
        <div class="text">
            <p>
                Depuis 2015, Karim Benzema est banni de l'équipe de football de France, malgré le fait qu'il est considéré comme l'un des meilleurs attaquants au monde.
                Cette décision a été prise lorsqu'un scandale de chantage entourant Benzema et un de ses coéquipiers à fait surface. Sans laisser la chance à Benzema de se
                défendre en cour, les sélectionneurs de l'équipe de France ont refusé d'appeler le talentueux joueur pour représenter son pays dans des tournois internationaux.
                Heureusement pour se dernier, le sélectionneur principal de l'équipe de France, Didier Deschamps, a décidé de le laisser participer à l'Euro 2021.
                Cette controverse a amené beaucoup de questionnements dans le monde du soccer, notamment au sujet de l'objectivité des décisions prises par les entraîneurs et sélectionneurs.
                En effet, la décision d'exclure Karim Benzema de l'équipe de France n'était clairement pas basée sur des statistiques objectives.
            </p>
            <p>
                Nous vous présentons donc une visualisation de données dans le but de dresser un portrait objectif de Karim Benzema en tant que joueur
                sans se préoccuper de l'aspect politique de la situation.
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
        width: 60%;
        color: white;
    }

    .container h1 {
        font-size: 64px;
    }
    
    .text {
        font-size: 24px;
    }
</style>
