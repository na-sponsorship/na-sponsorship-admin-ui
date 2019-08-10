<template lang="pug">
  v-data-table.elevation-1(:headers="headers" :items="children" :items-per-page="5")
    template(v-slot:top)
      v-toolbar(flat color="white")
        v-toolbar-title Children
        v-spacer
        v-dialog(v-model="dialog" max-width="800px")
          template(v-slot:activator="{on}")
            v-btn.mb-2(color="primary" dark v-on="on") Add Child
          v-card
            v-card-title: span.headline {{dialogTitle}}
            v-card-text
              v-form
                v-container(grid-list-xl)
                  v-layout(wrap)
                    v-flex: v-text-field(v-model="editedItem.firstName" label="First name")
                    v-flex: v-text-field(v-model="editedItem.lastName" label="Last name")
                  v-layout
                    v-flex
                      v-menu(v-model="pickBirthday" :close-on-content-click="false" transition="scale-transition" offset-y full-width min-width="290px")
                        template(v-slot:activator="{on}")
                          v-text-field(label="Birthday" readonly v-on="on")
                        v-date-picker(@input="pickBirthday = true")
                    v-flex: v-text-field(v-model="editedItem.firstName" label="Grade") 
                  v-layout
                    v-flex: v-textarea(v-model="editedItem.firstName" label="Story")
                  v-layout
                    v-flex: v-select(:items="['male', 'female']" label="Gender")
                    v-flex: v-text-field(v-model="editedItem.firstName" label="Sponsors Needed")
                  v-layout
                    v-flex: file-pond(ref="image" accepted-file-types="image/jpeg, image/png" :files="editedItem.image" label-idle="Drop child image here..." instant-upload="false")                  
            v-card-actions
              v-spacer
              v-btn(color="blue darken-1") Cancel
              v-btn(color="blue darken-1" @click="save(editedItem)") Save
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pickBirthday: false,
      dialog: false,
      editedIndex: -1,
      editedItem: {
        firstName: "",
        lastName: "",
        image: []
      },
      headers: [
        {
          text: "First Name",
          sortable: true,
          value: "firstName"
        },
        {
          text: "Last Name",
          sortable: true,
          value: "lastName"
        }
      ],
      children: []
    };
  },
  created() {
    axios.get(`${process.env.VUE_APP_API}/children`).then(children => {
      this.children = children.data.items;
    });
  },
  computed: {
    dialogTitle() {
      return this.editedIndex === -1 ? "Add Child" : "Edit Child";
    }
  },
  methods: {
    save(child) {
      this.$refs.image.server = `${process.env.VUE_APP_API}/children/upload`;
      
      axios.post(`${process.env.VUE_APP_API}/children`, child).then(id => {
        this.$refs.image.processFiles();
      });
    }
  }
};
</script>
