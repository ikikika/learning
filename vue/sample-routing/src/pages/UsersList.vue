<template>
  <button @click="saveChanges">Save changes</button>
  <ul>
    <user-item v-for="user in users" :key="user.id" :name="user.fullName" :role="user.role"></user-item>
  </ul>
</template>

<script>
import UserItem from '../components/users/UserItem.vue';

export default {
  components: {
    UserItem,
  },
  inject: ['users'],
  data() {
    return {
      changesSaved: false
    }
  },
  // beforeRouteEnter(_to, _from, next) {
  //   // vue will call this method before rendering the component
  // // },
  methods: {
    saveChanges() {
      this.changesSaved = true;
    }
  },
  beforeRouteLeave(to, from, next) {
    // eg, prompt user to save changes before leaving route
    if (this.changesSaved) {
      next();
    } else {
      const userWantsToLeave = confirm("Leave without saving changes?");
      next(userWantsToLeave)
    }
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 2rem auto;
  max-width: 20rem;
  padding: 0;
}
</style>