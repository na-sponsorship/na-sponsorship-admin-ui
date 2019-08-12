<template lang="pug">
v-card
  v-card-title: span.headline {{dialogTitle}}
  v-card-text
    v-form
      v-container(grid-list-xl)
        h2.title Child Information
        v-layout
          v-flex(grow md4): file-pond(ref="image" accepted-file-types="image/jpeg, image/png" label-idle="Select a photo" instant-upload="false")                  
          v-flex
            v-layout
              v-text-field.flex(v-model="model.firstName" label="First name")
              v-text-field.flex(v-model="model.lastName" label="Last name")
            v-layout
              v-text-field.flex(v-model="model.grade" label="Grade") 
              v-select.flex(v-model="model.gender" :items="['male', 'female']" label="Gender")
              v-menu(v-model="isSelectingBirthday" :nudge-right="40" transition="scale-transition" offset-y full-width min-width="290px")
                template(v-slot:activator="{ on }"): v-text-field.flex(v-model="model.dateOfBirth" label="Birthday" prepend-icon="fa-calendar-alt" v-on="on")
                v-date-picker(v-model="model.dateOfBirth" @input="isSelectingBirthday = false")
            v-layout
              v-flex: v-textarea(v-model="model.story" label="Story")
        h2.title Sponsorship Options
        v-layout
          v-text-field.flex(v-model="model.sponsorsNeeded" label="Sponsors Needed")
          v-text-field.flex(v-model="model.activeSponsors" label="Active Sponsors" disabled)
  v-card-actions
    v-spacer
    v-btn(text color="primary" @click="dismiss()") Cancel
    v-btn(color="primary" @click="save(editedItem)") Save   
</template>

<script>
export default {
  data() {
    return {
      isSelectingBirthday: false,
      model: {
        firstName: null,
        lastName: null,
        dateOfBirth: null,
        grade: null,
        story: null,
        gender: null,
        sponsorsNeeded: 2,
        activeSponsors: 0
      }
    };
  },
  computed: {
    dialogTitle() {
      return this.editedIndex === -1 ? "Add Child" : "Edit Child";
    }
  },
  methods: {
    dismiss() {
      this.$emit("dismissed");
    }
  }
};
</script>
