<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';
import { Bar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

@Component({
  extends: Bar,
  mixins: [reactiveProp]
})
export default class BarChart extends Vue {
  @Prop()
  chartData: any;

  @Prop({ default: function () { return {}; } })
  options!: object;

  @Watch('options')
  onChangeOptions() {
    this.$data._chart.options = this.options;
    this.$data._chart.update();
  }

  public renderChart!: (chartData: any, options: any) => void;

  mounted(): void {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
