<template>
    <li>
        <h2>{{ userDescription.name }} {{ userDescription.isSpecial ? '(Special)' : '' }}</h2>
        <button @click="makeUserSpecial(userDescription.id)">Toggle special</button>
        <button @click="toggleDetails">{{ detailsAreVisible ? 'Hide' : 'Show' }} Details</button>
        <ul v-if="detailsAreVisible">
            <li>{{ userDescription.email }}</li>
        </ul>
        <button @click="removeThisUser(userDescription.id)">Delete User</button>
    </li>
</template>

<script>

export default {
    props: {
        userDescription: {
            type: Object,
            required: true
        }
    },
    emits: ['toggle-special', 'delete-user'],
    data() {
        return {
            detailsAreVisible: false,
        }
    },
    inject: ['makeUserSpecial', 'removeThisUser'],
    methods: {
        toggleDetails() {
            this.detailsAreVisible = !this.detailsAreVisible;
        },
    }
};
</script>