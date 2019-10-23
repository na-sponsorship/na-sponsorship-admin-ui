<template lang="pug">
v-card
  v-card-title: span.headline {{isEditing ? 'Edit' : 'Add'}} Child
  v-card-text
    ValidationObserver(ref="form" v-slot="{invalid}")
      v-form
        v-container(grid-list-xl)
          h2.title Child Information
          v-layout
            v-flex(grow md4 text-center)
              file-pond(v-bind="filePondConfig")               
            v-flex
              v-layout
                ValidationProvider(rules="required" v-slot="{errors}" name="first name" slim)
                  v-text-field.flex(v-model="updatedChild.firstName" label="First name" :error-messages="errors")
                ValidationProvider(rules="required" v-slot="{errors}" name="last name" slim)
                  v-text-field.flex(v-model="updatedChild.lastName" label="Last name" :error-messages="errors")
              v-layout
                ValidationProvider(rules="required|numeric" v-slot="{errors}" name="grade" slim)
                  v-text-field.flex(v-model="updatedChild.grade" label="Grade" :error-messages="errors") 
                ValidationProvider(rules="required" v-slot="{errors}" name="gender" slim)
                  v-select.flex(v-model="updatedChild.gender" :items="['male', 'female']" label="Gender" :error-messages="errors")
                v-menu(v-model="isSelectingBirthday" :nudge-right="40" transition="scale-transition" offset-y full-width min-width="290px")
                  template(v-slot:activator="{ on }")
                    ValidationProvider(rules="required" v-slot="{errors}" name="date of birth" slim)
                      v-text-field.flex(v-model="updatedChild.dateOfBirth" label="Birthday" prepend-icon="fa-calendar-alt" v-on="on" :error-messages="errors" readonly)
                  v-date-picker(v-model="updatedChild.dateOfBirth" @input="isSelectingBirthday = false")
              v-layout
                v-flex
                  ValidationProvider(rules="required" v-slot="{errors}" name="story" slim)
                    v-textarea(v-model="updatedChild.story" label="Story" :error-messages="errors")
          h2.title Sponsorship Options
          v-layout
            v-text-field.flex(v-model="updatedChild.sponsorsNeeded" label="Sponsors Needed")
            v-text-field.flex(v-model="updatedChild.activeSponsors" label="Active Sponsors" disabled)
  v-card-actions
    v-spacer
    v-btn(text color="primary" @click="dismiss()") Cancel
    v-btn(color="primary" @click="save(updatedChild)" :loading="isSaving") {{isEditing ? 'Save' : 'Add'}}   
</template>

<script>
import store from "store";
import { isNull, replace } from "lodash";
import { CldImage } from "cloudinary-vue";

import ChildEntity from "../../store/entities/child.entity";

export default {
  components: { CldImage },
  props: ["child"],
  data() {
    return {
      isSaving: false,
      isSelectingBirthday: false,
      updatedChild: new ChildEntity(),
    };
  },
  created() {
    this.updatedChild = new ChildEntity(this.child);
    this.updatedChild.story = replace(this.updatedChild.story, /\n/g, " ");
  },
  computed: {
    isEditing() {
      return !isNull(this.updatedChild.id);
    },
    filePondConfig() {
      let initialFile = [];

      if (this.updatedChild.image) {
        initialFile.push({
          source: this.updatedChild.image,
          options: {
            type: "local",
            metadata: {
              isLocal: true,
            },
          },
        });
      }

      return {
        ref: "image",
        files: initialFile,
        acceptedFileTypes: "image/jpeg, image/png",
        labelIdle: "Select a photo",
        instantUpload: "false",
        allowImageCrop: "true",
        imageCropAspectRatio: "1:1",
        allowImageResize: "true",
        imageResizeTargetWidth: "700",
        server: {
          url: `${process.env.VUE_APP_API}/children`,
          process: {
            url: "/upload",
            headers: {
              Authorization: `Bearer ${store.get("access_token")}`,
            },
          },
          load: {
            url: "/loadImage/",
            headers: {
              Authorization: `Bearer ${store.get("access_token")}`,
            },
          },
        },
      };
    },
  },
  methods: {
    async save(child) {
      const isValid = await this.$refs.form.validate();

      if (!isValid) {
        return;
      }

      let child_id;
      this.isSaving = true;

      if (this.isEditing) {
        child.$save();
        await ChildEntity.$update({ params: { id: child.id }, data: child });
        child_id = child.id;
      } else {
        const { id } = await ChildEntity.$create({ data: child });
        child_id = id;
      }

      // Upload image
      const imageFile = this.$refs.image.getFile();

      if (!isNull(imageFile) && !imageFile.getMetadata()["isLocal"]) {
        imageFile.setMetadata("child_id", child_id);
        await this.$refs.image.processFiles();
      }

      this.dismiss();
      this.isSaving = false;
    },

    dismiss() {
      this.$emit("dismissed");

      if (this.$refs.image) {
        this.$refs.image.removeFiles();
      }
    },
  },
};
</script>
