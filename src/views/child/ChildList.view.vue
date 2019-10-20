<template lang="pug">
  v-container(fluid)
    v-row(align-content="center")
      v-col: v-text-field(label="Search" v-model="searchQuery")
      v-col.flex-grow-0(align-self="center"): v-btn(color="primary" @click="editChild(null)") Add Child
    v-row
      v-col
        v-tabs
          v-tab All ({{children.length}})
          v-tab Archived ({{archivedChildren.length}})
          v-tab-item
            v-data-table.elevation-0(:headers="headers" :items="children" :items-per-page="10" fixed-header no-data-text="There are no children to display" :search="searchQuery" :no-results-text="`No children found matching '${searchQuery}'`" :loading="isLoading")
              template(v-slot:item.index="{item}") {{children.indexOf(item) + 1}}
              template(v-slot:item.action="{item}")
                v-btn(text color="primary" @click="activeChild = item.id; isEditing = true;") Edit
                v-btn(text color="error" @click="activeChild = item.id; confirmArchive = true;") Archive
          v-tab-item.pt-3
            span.mx-5 Archived children are not displayed to the user and cannot be sponsored. Any existing sponsorships are continued.
            v-data-table.elevation-0(:headers="headers" :items="archivedChildren" :items-per-page="10" fixed-header no-data-text="There are no children to display" :search="searchQuery" :no-results-text="`No children found matching '${searchQuery}'`" :loading="isLoading")
              template(v-slot:item.index="{item}") {{archivedChildren.indexOf(item) + 1}}
              template(v-slot:item.action="{item}")
                v-btn(text color="primary" @click="activeChild = item.id; isEditing = true;") Edit
                v-btn(text color="success" @click="activeChild = item.id; confirmUnarchive = true;") Unarchive
    v-dialog(v-model="isEditing" max-width="1000" persistent v-if="isEditing")
      ChildEditDialog(@dismissed="onDismissed" :child="selectedChild")        
    v-dialog(v-model="confirmArchive" width="700" v-if="selectedChild")
      v-card
        v-card-title(primary-title) Are you sure you want to Archive&nbsp;
          strong "{{selectedChild.firstName}} {{selectedChild.lastName}}"? 
        v-divider
        v-card-actions
          div.flex-grow-1
          v-btn(color="primary" text @click="confirmArchive = false") No     
          v-btn(color="primary" @click="archiveChild(selectedChild)") Yes     
    v-dialog(v-model="confirmUnarchive" width="700" v-if="selectedChild")
      v-card
        v-card-title(primary-title) Are you sure you want to Unarchive&nbsp;
          strong "{{selectedChild.firstName}} {{selectedChild.lastName}}"? 
        v-divider
        v-card-actions
          div.flex-grow-1
          v-btn(color="primary" text @click="confirmUnarchive = false") No     
          v-btn(color="primary" @click="unArchiveChild(selectedChild)") Yes     
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
      confirmArchive: false,
      confirmUnarchive: false,
      activeChild: null,
      searchQuery: null,
      editedIndex: -1,
      headers: [
        {
          text: "#",
          value: "index",
          sortable: false,
        },
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
          .where("archived", false)
          .get() || []
      );
    },
    archivedChildren() {
      return (
        ChildEntity.query()
          .where("archived", true)
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
    async archiveChild(child) {
      await child.archive();
      ChildEntity.update({ where: child.id, data: { archived: true } });

      this.confirmArchive = false;
    },
    async unArchiveChild(child) {
      await child.unarchive();
      ChildEntity.update({ where: child.id, data: { archived: false } });

      this.confirmUnarchive = false;
    },
    onDismissed() {
      this.isEditing = false;
      this.activeChild = null;
      ChildEntity.$fetch();
    },
  },
};
</script>
