<template lang="pug">
v-card
  v-card-title: span.headline {{isEditing ? 'Edit' : 'Add'}} Child
  v-card-text
    v-form
      v-container(grid-list-xl)
        h2.title Child Information
        v-layout
          v-flex(grow md4)
            cld-image(v-if="model.image" :publicId="model.image"): cld-transformation(width="250" height="350" gravity="face" crop="fill")
            file-pond(v-if="!model.image" v-bind="filePondConfig")               
          v-flex
            v-layout
              v-text-field.flex(v-model="model.firstName" label="First name")
              v-text-field.flex(v-model="model.lastName" label="Last name" required)
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
    v-btn(color="primary" @click="save(model)") Save   
</template>

<script>
import store from "store";
import axios from "axios";
import { isNull, isEmpty } from "lodash";
import { CldImage, CldTransformation } from "cloudinary-vue";

export default {
  components: { CldImage, CldTransformation },
  props: ["data"],
  data() {
    return {
      isSelectingBirthday: false,
      filePondConfig: {
        ref: "image",
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
              Authorization: `Bearer ${store.get("access_token")}`
            }
          }
        }
      },
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
  watch: {
    data: function(newVal) {
      if (!isNull(newVal)) {
        this.model = newVal;
      }
    }
  },
  computed: {
    isEditing() {
      return !isNull(this.data);
    }
  },
  methods: {
    save(child) {
      const imageFile = this.$refs.image.getFile();

      axios({
        method: this.isEditing ? "PUT" : "POST",
        url: `${process.env.VUE_APP_API}/children`,
        data: child
      }).then(({ data }) => {
        if (!isNull(imageFile)) {
          imageFile.setMetadata("child-id", data);
          imageFile.setMetadata(
            "child-name",
            `${child.firstName} ${child.lastName}`
          );

          if (this.isEditing) {
            imageFile.setMetadata("is-editing", true);
          }

          this.$refs.image.processFiles().then(() => this.dismiss());
        } else {
          this.dismiss();
        }
      });
    },
    dismiss() {
      this.$emit("dismissed");

      if (this.$refs.image) {
        this.$refs.image.removeFiles();
      }

      // Clear model
      this.model = {
        firstName: null,
        lastName: null,
        dateOfBirth: null,
        grade: null,
        story: null,
        gender: null,
        sponsorsNeeded: 2,
        activeSponsors: 0
      };
    }
  }
};
</script>
