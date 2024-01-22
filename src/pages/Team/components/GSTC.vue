<template>
  <div class="gstc-component" ref="gstc" id="gstc-component"></div>
</template>

<script>
import GSTC from 'gantt-schedule-timeline-calendar';
import 'gantt-schedule-timeline-calendar/dist/style.css';
let state,
  gstc,
  loaded = false;
export { GSTC };
export default {
  name: 'GSTC',
  props: ['config'],
  mounted() {
    this.$refs.gstc.addEventListener('gstc-loaded', () => {
      if (!loaded) {
        loaded = true;
        this.$emit('loaded', gstc);
      }
    });
    state = GSTC.api.stateFromConfig({});
    this.$watch(
      'config',
      (config) => {
            // eslint-disable-next-line no-unused-vars
            state.update('config', (current) => {
              current.list.rows = {
                "1": {
                  id: "",
                  story: "",
                  assignee: "",
                  expanded: true
                },
              }
              current.chart.items = {}
              const cfg = GSTC.api.merge({}, current, config);
              console.log('updated-config', cfg)
              return cfg;
            });
            if (gstc && gstc.component) gstc.component.update();
          },
          {deep: true, immediate: true}
        );
        this.$emit('state', state);
        gstc = GSTC({
          element: this.$refs.gstc,
          state,
        });
  },
  beforeUnmount() {
    if (gstc) gstc.destroy();
  },
};
</script>
<style scoped lang="scss">
.gstc-component {
  margin: 0;
  padding: 0;
}

</style>
