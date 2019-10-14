<template lang="pug">
  v-container(fluid)
    v-row(align-content="center")
      v-col: v-text-field(label="Search" v-model="searchQuery")
      v-col.flex-grow-0(align-self="center"): v-btn(color="primary" @click="editChild(null)") Add Child
    v-row
      v-col
        v-data-table.elevation-0(:headers="headers" :items="children" :items-per-page="10" fixed-header no-data-text="There are no children to display" :search="searchQuery" :no-results-text="`No children found matching '${searchQuery}'`" :loading="isLoading")
          template(v-slot:item.action="{item}")
            v-btn(text color="primary" @click="activeChild = item.id; isEditing = true;") Edit
            v-btn(text color="error" @click="activeChild = item.id; confirmDelete = true;") Delete
          
    v-dialog(v-model="isEditing" max-width="800px" persistent v-if="isEditing")
      ChildEditDialog(@dismissed="onDismissed" :child="selectedChild")        
    v-dialog(v-model="confirmDelete" width="500" v-if="selectedChild")
      v-card
        v-card-title(primary-title) Are you sure you want to delete&nbsp;
          i {{selectedChild.firstName}} {{selectedChild.lastName}}? 
        v-divider
        v-card-actions
          div.flex-grow-1
          v-btn(color="primary" text @click="confirmDelete = false") No     
          v-btn(color="primary" @click="removeChild(activeChild)" :loading="selectedChild.$isDeleting") Yes     
</template>

<script>
import axios from "axios";
import { isNull } from "lodash";
import { mapActions } from "vuex";

import ChildEditDialog from "./ChildEdit.dialog";
import Child from "../../store/entities/child.entity";

export default {
  components: { ChildEditDialog },
  data() {
    return {
      isLoading: false,
      isEditing: false,
      confirmDelete: false,
      activeChild: null,
      searchQuery: null,
      editedIndex: -1,
      headers: [
        {
          text: "First Name",
          sortable: true,
          value: "firstName",
        },
        {
          text: "Last Name",
          sortable: true,
          value: "lastName",
        },
        {
          value: "action",
          align: "end",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    children() {
      return Child.all() || [];
    },
    selectedChild() {
      return Child.find(this.activeChild);
    },
  },
  async created() {
    await Child.$fetch();
  },
  methods: {
    editChild(child) {
      if (!isNull(child)) {
        this.activeChild = child;
      }

      this.isEditing = true;
    },
    async removeChild(id) {
      await Child.$delete({ params: { id } });

      Child.delete(id);
      this.confirmDelete = false;
    },
    onDismissed() {
      this.isEditing = false;
      this.activeChild = null;
      Child.$fetch();
    },
  },
};
</script>
