<template>
  <div v-resize="onResize">
    <div ref="resizableDiv">
      <slot name="table" :table-height="tableHeight" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResizablePage',
  data() {
    return {
      tableHeight: 0,
    }
  },
  props: {
    footerHeight: {
      type: Number,
      default: 91, //default 59 v-data-table footer height + v-card padding 16*2
    },
  },
  methods: {
    onResize() {
      this.tableHeight =
        window.innerHeight -
        this.$refs.resizableDiv.getBoundingClientRect().y -
        this.footerHeight
    },
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.onResize()
    })
  },
}
</script>