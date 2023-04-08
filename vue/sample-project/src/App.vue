<template>
    <header>
        <h1>{{ users.length }} {{ title }}</h1>
    </header>
    <new-user @add-contact="addUser" />
    <div v-if="users.length === 0">No users</div>
    <user-div v-else @toggle-special="toggleSpecialStatus" @delete-user="deleteUser" />
</template>

<script>

import UserDiv from "./components/UserDiv.vue"
import NewUser from "./components/NewUser.vue";

export default {
    components: {
        UserDiv, NewUser
    },
    data() {
        return {
            title: "Users",
            users: [
                {
                    id: 1231,
                    name: "user1",
                    email: "user1@example.com",
                    isSpecial: false
                },
                {
                    id: 1232,
                    name: "user2",
                    email: "user2@example.com",
                    isSpecial: true
                },
            ],
            message: ['hello', 'you']
        };
    },
    provide() {
        return {
            usersProvided: this.users,
            makeUserSpecial: this.toggleSpecialStatus,
            removeThisUser: this.deleteUser,
        }
    },
    methods: {
        toggleSpecialStatus(userId) {
            const identifiedUser = this.users.find(user => user.id === userId);
            identifiedUser.isSpecial = !identifiedUser.isSpecial;
        },
        addUser(name, email) {
            this.users.push({
                id: new Date().getTime(),
                name,
                email,
                isSpecial: false
            });
        },
        deleteUser(userId) {
            const userIndex = this.users.findIndex(user => user.id === userId);
            this.users.splice(userIndex, 1);
        }
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jost&display=swap');

* {
    box-sizing: border-box;
}

html {
    font-family: 'Jost', sans-serif;
}

body {
    margin: 0;
}

header {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 3rem auto;
    border-radius: 10px;
    padding: 1rem;
    background-color: #58004d;
    color: white;
    text-align: center;
    width: 90%;
    max-width: 40rem;
}

#app ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

#app li,
#app form {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 1rem auto;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 90%;
    max-width: 40rem;
}

#app h2 {
    font-size: 2rem;
    border-bottom: 4px solid #ccc;
    color: #58004d;
    margin: 0 0 1rem 0;
}

#app button {
    font: inherit;
    cursor: pointer;
    border: 1px solid #ff0077;
    background-color: #ff0077;
    color: white;
    padding: 0.05rem 1rem;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.26);
}

#app button:hover,
#app button:active {
    background-color: #ec3169;
    border-color: #ec3169;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26);
}

#app input {
    font: inherit;
    padding: 0.15rem;
}

#app label {
    font-weight: bold;
    margin-right: 1rem;
    width: 7rem;
    display: inline-block;
}

#app form div {
    margin: 1rem 0;
}
</style>