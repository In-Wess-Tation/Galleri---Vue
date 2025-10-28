const app = Vue.createApp({
    data() {
        return {
            ocArt: [
               'OC Art 1',
               'OC Art 2',
               'OC Art 3'
            ],
            showOcArt: true,
            fanArt: [
               'Fan Art 1',
               'Fan Art 2',
               'Fan Art 3'
            ],
            showFanArt: true,
            mlpArt: [
               'MLP Art 1',
               'MLP Art 2',
               'MLP Art 3'
            ],
            showMlpArt: true,
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
        }

    },
    computed: {
        myComputed() {
            return ''
        },
        
    }
})
