<template>
  <v-dialog v-model="isOpen" :width="width">
    <v-card>
      <v-card-title class="title">{{ title }}</v-card-title>
      <v-card-text class="px-6 mt-n4 py-2" v-if="$slots.default">
        <slot />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="onDismiss">No</v-btn>
        <v-btn color="primary" text @click="onConfirm">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  created() {
    // debugger;
  },
  methods: {
    open() {
      this.isOpen = true;
    },
    onDismiss() {
      this.isOpen = false;
      this.$emit("onDismissed");
    },
    onConfirm() {
      this.isOpen = false;
      this.$emit("onConfirm");
    },
  },
};
</script>
