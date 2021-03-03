<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';
import { Doughnut, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

@Component({
  extends: Doughnut,
  mixins: [reactiveProp]
})
export default class DoughnutChart extends Vue {
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
  public addPlugin!: (plugin?: object) => void;

  mounted(): void {
    this.addPlugin({
      id: 'plugin',
      beforeDraw: this.plugin
    });

    this.renderChart(this.chartData, this.options);
  }

  plugin(chart) {
    const width = chart.chart.width;
    const height = chart.chart.height;
    const ctx = chart.chart.ctx;
    const color = '#2ED47A';

    ctx.restore();
    const fontSize = (height / 114).toFixed(2);
    ctx.font = fontSize + 'em sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;

    const text = (this.options as any).elements.center.text;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2 - 10;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};
</script>
