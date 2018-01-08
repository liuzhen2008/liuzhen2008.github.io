<template>
  <div class="hello">
    <p>what coin(waves/dgb/shitcoin)</p>
    <input v-model="coin"/>
    <p>what base coin(BTC/ETH/USDT/BNB)</p>
    <input v-model="basecoin"/>
    <p>Specify your start date.</p>
    <date-picker v-model="startTime" type="datetime" format="yyyy-MM-dd hh:mm:ss a" :not-after="today" lang="en"></date-picker>
    <br/>
    <button v-on:click="calculate">Lets calculate this flow thing</button>
    <div v-if="(calculating && !error)">
      <h2>Calculating order flow for the last {{ Math.round((Date.now() - startTime.getTime()) / 1000 / 3600) }} hours or last {{ Math.round((Date.now() - startTime.getTime()) / 1000 / 60) }} minutes</h2>
    </div>
    <div v-if="error">{{ error.message }}</div>
    <div v-if="(flowResults.length !== 0)">
      <ul>
        <li v-for="flowResult in flowResults">
          Flow value for {{ coin }}/{{ basecoin }} from {{ (new Date(startTime)).toLocaleString() }} to {{ (new Date(flowResult.date)).toLocaleString() }} is {{ flowResult.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import DatePicker from 'vue2-datepicker'
  import tradeList from '../helper/tradeList'
  import { mapState } from 'vuex'

  export default {
    name: "hello",
    components: {DatePicker},
    computed: mapState(['flowResults']),
    data () {
      return {
        error: null,
        calculating: false,
        coin: "",
        basecoin: "btc",
        startTime: new Date(Date.now() - 1000 * 3600 * 24),
        today: new Date(),
        shortcuts: [
          {
            end: new Date()
          }
        ]
      }
    },
    methods: {
      calculate () {
        this.calculating = true;
        tradeList.getFlow(this.$store, this.coin, this.basecoin, this.startTime);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
    margin: 0;
  }
  .hello {
    padding-left: 50px;
  }
</style>
