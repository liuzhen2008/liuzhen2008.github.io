<template>
  <div class="hello">
    <p>Enter a coin ticker that is being bought (waves/mtl/nav/eth)</p>
    <input v-model="coin"/>
    <p>Enter a base coin ticker (BTC/ETH/USDT/BNB)</p>
    <input v-model="basecoin"/>
    <p>Specify your start date. This is default to 24 hrs ago. </p>
    <date-picker v-model="startTime" type="datetime" format="yyyy-MM-dd hh:mm:ss a" :not-after="today" lang="en"></date-picker>
    <p>Specify your end date. <button v-on:click="setDefaultEndTime">Use current time</button></p>
    <date-picker v-model="endTime" type="datetime" format="yyyy-MM-dd hh:mm:ss a" :not-before="startTime" lang="en"></date-picker>
    <br/>
    <button v-on:click="calculate">Lets calculate this flow thing</button>
    <div v-if="(calculating && !error)">
      <h2>Calculating order flow from {{ (new Date(startTime)).toLocaleString() }} to {{ (new Date(endTime)).toLocaleString() }}</h2>
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
        endTime: new Date(),
        today: new Date(Date.now() + 1000 * 3600),
        shortcuts: [
          {
            end: new Date()
          }
        ]
      }
    },
    methods: {
      setDefaultEndTime () {
        this.endTime = new Date();
      },
      calculate () {
        if (!this.coin || !this.basecoin || !this.startTime || !this.endTime) {
          alert("Please fill out everything first");
          return;
        }
        this.calculating = true;
        tradeList.Flow(this.$store, this.coin, this.basecoin, this.startTime, this.endTime);
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
