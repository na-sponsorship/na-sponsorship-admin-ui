<template lang="pug">
	v-container(fluid)
		v-snackbar(v-model="toast" color="red darken-2" :timeout="5000") {{toast_message}}
		v-row(align-content="center")
			v-col: v-text-field(label="Search" v-model="searchQuery")
			v-col.flex-grow-0(align-self="center"): v-btn(color="primary" @click="editUser(null)") Add User
		v-row
			v-col
				v-data-table.elevation-0(:headers="headers" :items="users" :items-per-page="10" fixed-header no-data-text="There are no children to display" :search="searchQuery" :no-results-text="`No children found matching '${searchQuery}'`" :loading="isLoading")
					template(v-slot:item.name="{value}") {{value === 'null null'? '': value}}
					template(v-slot:item.action="{item}")
						v-btn(text color="error" @click="activeUser = item.id; confirmDelete = true;") Delete
		v-dialog(v-model="isEditing" max-width="700" persistent v-if="isEditing")
			UserEditDialog(@dismissed="onDismissed" :user="activeUser")                    
		v-dialog(v-model="confirmDelete" width="700" v-if="activeUser")
			v-card
				v-card-title(primary-title) Are you sure you want to delete&nbsp;
					strong "{{selectedUser.username}} {{selectedUser.lastName}}"? 
				v-divider
				v-card-actions
					div.flex-grow-1
					v-btn(color="primary" text @click="confirmDelete = false") No     
					v-btn(color="primary" @click="removeUser(selectedUser)" :loading="selectedUser.$isDeleting") Yes     
</template>

<script>
import { get, isNull } from "lodash";

import UserEntity from "../../store/entities/user.entity";
import UserEditDialog from "./UserEdit.dialog";

export default {
  components: { UserEditDialog },
  data() {
    return {
      isEditing: false,
      isLoading: false,
      confirmDelete: false,
      activeUser: null,
      searchQuery: null,
      toast: false,
      toast_message: "",
      headers: [
        {
          text: "Username",
          sortable: true,
          value: "username",
        },
        {
          text: "Name",
          sortable: true,
          value: "name",
        },
        {
          value: "action",
          align: "end",
          sortable: false,
        },
      ],
    };
  },
  async created() {
    this.isLoading = true;
    await UserEntity.$fetch();
    this.isLoading = false;
  },
  computed: {
    users() {
      return UserEntity.all() || [];
    },
    selectedUser() {
      return UserEntity.find(this.activeUser) || {};
    },
  },
  methods: {
    async removeUser(user) {
      try {
        await UserEntity.$delete({ params: { id: user.id } });
        UserEntity.delete(user.id);
      } catch (err) {
        this.toast = true;
        this.toast_message = get(err, "response.data.message");
      }
      this.confirmDelete = false;
    },
    editUser(user) {
      if (!isNull(user)) {
        this.activeUser = user;
      }

      this.isEditing = true;
    },
    onDismissed() {
      this.isEditing = false;
      this.activeUser = null;
    },
  },
};
</script>
