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
                v-btn(text color="error" @click="activeChild = item.id; $refs.archiveDialog.open()") Archive
          v-tab-item.pt-3
            span.mx-5 Archived children are not displayed to the user and cannot be sponsored. Any existing sponsorships are continued.
            v-data-table.elevation-0(:headers="headers" :items="archivedChildren" :items-per-page="10" fixed-header no-data-text="There are no children to display" :search="searchQuery" :no-results-text="`No children found matching '${searchQuery}'`" :loading="isLoading")
              template(v-slot:item.index="{item}") {{archivedChildren.indexOf(item) + 1}}
              template(v-slot:item.action="{item}")
                v-btn(text color="primary" @click="activeChild = item.id; isEditing = true;") Edit
                v-btn(text color="success" @click="activeChild = item.id; $refs.unarchiveDialog.open()") Unarchive
                v-btn(text color="error" @click="activeChild = item.id; $refs.deleteDialog.open()") Delete
    v-dialog(v-model="isEditing" max-width="1000" persistent v-if="isEditing")
      ChildEditDialog(@dismissed="onDismissed" :child="selectedChild")        
    DialogUi(ref="archiveDialog" :title="`Are you sure you want to archive \"${selectedChild.name}\"?`" @onConfirm="archiveChild(selectedChild)")
      p.mt-5
        strong Note: 
        | This will hide the child and prevent them from being sponsored. Existing sponsorships will continue.    
    DialogUi(ref="unarchiveDialog" :title="`Are you sure you want to unarchive \"${selectedChild.name}\"?`" @onConfirm="unArchiveChild(selectedChild)")
    DialogUi(ref="deleteDialog" :title="`Are you sure you want to delete \"${selectedChild.name}\"?`" @onConfirm="deleteChild(selectedChild)")
      | This action cannot be undone.
      p.mt-5
        strong Note: 
        | This child will be removed from the system. Existing sponsorships will be terminated. Sponsors that are sponsoring this child will be notified that their sponsorship has been terminated.
</template>

<script>
import { isNull } from "lodash";
import DialogUi from "../../components/dialog.ui";

import ChildEditDialog from "./ChildEdit.dialog";
import ChildEntity from "../../store/entities/child.entity";

export default {
  components: { ChildEditDialog, DialogUi },
  data() {
    return {
      isLoading: false,
      isEditing: false,
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
      return ChildEntity.find(this.activeChild) || new ChildEntity();
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
    async deleteChild(child) {
      await ChildEntity.$delete({ params: { id: child.id } });
      ChildEntity.delete(child.id);
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
