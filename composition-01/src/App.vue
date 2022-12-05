<template>
  <section class="container">
    <user-data :first-name="firstName" :last-name="lastName" />
    <button @click="setAge">Set age</button>
    <div>
      <input type="text" placeholder="First Name" v-model="firstName" />
      <input type="text" placeholder="Last Name" v-model="lastName" />
    </div>
  </section>
</template>

<script>
import {
  reactive, ref,
  // computed, 
  watch,
  provide
} from 'vue';
import UserData from './components/UserData';

export default {
  components: {
    UserData
  },
  setup() {
    const user = reactive({ name: 'Sample', age: 31 });
    const uAge = ref(0)

    function setNewAge() {
      user.age = 32;
      uAge.value++;
    }

    const firstName = ref('fn');
    const lastName = ref('ln');

    function setFirstName(event) {
      firstName.value = event.target.value;
    }

    function setLastName(event) {
      lastName.value = event.target.value;
    }

    provide('userAge', uAge);

    // const uName = computed(function () {
    //   return firstName.value + ' ' + lastName.value;
    // });


    watch(uAge, function (newValue, oldValue) {
      // whenever uAge changes, this function runs  
      // pass array for multiple dependency
      console.log('newValue', newValue);
      console.log('oldValue', oldValue);
    });

    return {
      user,
      setAge: setNewAge,
      // uName,
      setFirstName,
      setLastName,
      firstName,
      lastName,
      uAge
    }
  }
}

</script>

<style>
* {
  box-sizing: border-box;
}

html {
  font-family: sans-serif;
}

body {
  margin: 0;
}

.container {
  margin: 3rem auto;
  max-width: 30rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  text-align: center;
}
</style>