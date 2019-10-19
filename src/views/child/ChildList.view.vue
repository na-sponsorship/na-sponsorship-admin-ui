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
          
    v-dialog(v-model="isEditing" max-width="1000" persistent v-if="isEditing")
      ChildEditDialog(@dismissed="onDismissed" :child="selectedChild")        
    v-dialog(v-model="confirmDelete" width="700" v-if="selectedChild")
      v-card
        v-card-title(primary-title) Are you sure you want to delete&nbsp;
          strong "{{selectedChild.firstName}} {{selectedChild.lastName}}"? 
        v-divider
        v-card-actions
          div.flex-grow-1
          v-btn(color="primary" text @click="confirmDelete = false") No     
          v-btn(color="primary" @click="removeChild(activeChild)" :loading="selectedChild.$isDeleting") Yes     
</template>

<script>
import { isNull } from "lodash";

import ChildEditDialog from "./ChildEdit.dialog";
import ChildEntity from "../../store/entities/child.entity";

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
      return (
        ChildEntity.query()
          .where("deleted", false)
          .get() || []
      );
    },
    selectedChild() {
      return ChildEntity.find(this.activeChild);
    },
  },
  async created() {
    await ChildEntity.$fetch();
  },
  methods: {
    editChild(child) {
      if (!isNull(child)) {
        this.activeChild = child;
      }

      this.isEditing = true;
    },
    async removeChild(id) {
      await ChildEntity.$delete({ params: { id } });

      ChildEntity.delete(id);
      this.confirmDelete = false;
    },
    onDismissed() {
      this.isEditing = false;
      this.activeChild = null;
      ChildEntity.$fetch();
    },
  },
};
</script>
