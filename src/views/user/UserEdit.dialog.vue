<template lang="pug">
v-card
  v-card-title: span.headline {{isEditing ? 'Edit' : 'Add'}} User
  v-card-text
    ValidationObserver(ref="form" v-slot="{invalid}")
      v-form
        v-container(grid-list-xl)
          h2.title Account Information
          v-layout            
            v-flex
              v-layout
                ValidationProvider(rules="required|email" v-slot="{errors}" name="email" slim)
                  v-text-field.flex(v-model="updatedUser.username" label="Email" :error-messages="errors")
                ValidationProvider(rules="required|min:6" v-slot="{errors}" name="temporary password" slim)
                  v-text-field.flex(v-model="updatedUser.password" :type="passwordVisibility ? 'input' : 'password'" @click:append="passwordVisibility = !passwordVisibility" :append-icon="passwordVisibility ? 'fa fa-eye': 'fa fa-eye-slash'" label="Temporary Password" :error-messages="errors" hint="User will be asked to change their password upon logging in" :persistent-hint="true")
              v-layout
                ValidationProvider(rules="required" v-slot="{errors}" name="temporary password" slim)
                  v-select.flex(v-model="updatedUser.role" :items="roles" label="Role" :error-messages="errors")
  v-card-actions
    v-spacer
    v-btn(text color="primary" @click="$emit('dismissed')") Cancel
    v-btn(color="primary" @click="save(updatedUser)" :loading="isSaving") {{isEditing ? 'Save' : 'Add'}}   
</template>

<script>
import store from "store";
import axios from "axios";
import { isNull, isEmpty } from "lodash";

import UserEntity from "../../store/entities/user.entity";

export default {
  props: ["user"],
  data() {
    return {
      passwordVisibility: false,
      isSaving: false,
      roles: ["Admin", "Editor"],
      updatedUser: new UserEntity(),
    };
  },
  created() {
    this.updatedUser = new UserEntity(this.user);
  },
  computed: {
    isEditing() {
      return !isNull(this.updatedUser.id);
    },
  },
  methods: {
    async save(user) {
      const isValid = await this.$refs.form.validate();

      if (!isValid) {
        return;
      }

      this.isSaving = true;

      if (this.isEditing) {
        user.$save();
        await UserEntity.$update({ params: { id: user.id }, data: user });
      } else {
        await UserEntity.$create({ data: user });
      }

      this.$emit("dismissed");
      this.isSaving = false;
    },
  },
};
</script>
