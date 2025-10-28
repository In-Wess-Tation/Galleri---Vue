const app = Vue.createApp({
    data() {
        return {
            ocArt: [
               'OC Art 1',
               'OC Art 2',
               'OC Art 3'
            ],
            showOcArt: false,
            fanArt: [
               'Fan Art 1',
               'Fan Art 2',
               'Fan Art 3'
            ],
            showFanArt: false,
            mlpArt: [
               'MLP Art 1',
               'MLP Art 2',
               'MLP Art 3'
            ],
            showMlpArt: false,
            twilightSparkle: [
                'Twilight Sparkle Art 1',
                'Twilight Sparkle Art 2',
                'Twilight Sparkle Art 3'
            ],
            showTwilightSparkle: false,
            mlpPrincesses: [
                'PrincessCelestia',
                'PrincessLuna',
                'PrincessCadance',
                'PrincessTwilight'
            ],
            showMlpPrincesses: false,
            prideGallery: [
                'Pride Art 1',
                'Pride Art 2',
                'Pride Art 3'
            ],
            showPrideArt: false
        }
    },
    methods: {
        myMethod(){

        },
        showOc(){
            this.showOcArt = !this.showOcArt
        },
        showFan(){
            this.showFanArt = !this.showFanArt
        },
        showMlp(){
            this.showMlpArt = !this.showMlpArt
        },
        showMlpTS(){
            this.showTwilightSparkle = !this.showTwilightSparkle
        },
        showMlpP(){
            this.showMlpPrincesses = !this.showMlpPrincesses
        },
        showPride(){
            this.showPrideArt = !this.showPrideArt
        }

    },
    computed: {
        myComputed() {
            return ''
        },
        
    }
})
