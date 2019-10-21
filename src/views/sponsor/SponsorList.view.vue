<template lang="pug">
  v-container(fluid)
    v-row(align-content="center")
      v-col: v-text-field(label="Search" v-model="searchQuery")
    v-row
      v-col
        v-data-table.elevation-0(:headers="headers" :items="sponsors" :items-per-page="10" fixed-header no-data-text="There are no sponsors to display" :search="searchQuery" :no-results-text="`No children found matching '${searchQuery}'`" :loading="isLoading")
          template(v-slot:item.index="{item}") {{sponsors.indexOf(item) + 1}}
          template(v-slot:item.children="{item}") {{item.children.length}}
</template>

<script>
import { isNull } from "lodash";
import DialogUi from "../../components/dialog.ui";

import SponsorEntity from "../../store/entities/sponsor.entity";

export default {
  components: { DialogUi },
  data() {
    return {
      isLoading: false,
      searchQuery: null,
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
          text: "Email",
          sortable: true,
          value: "email",
        },
        {
          text: "Children Sponsoring",
          sortable: true,
          value: "children",
        },
      ],
    };
  },
  computed: {
    sponsors() {
      return SponsorEntity.all();
    },
  },
  async created() {
    await SponsorEntity.$fetch();
  },
};
</script>
