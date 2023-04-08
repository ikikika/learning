<template>
    <form @submit.prevent="submitForm">
        <input placeholder="name" v-model="inputName" />
        <input placeholder="email" v-model="inputEmail" />
        <button type="submit">Submit</button>
    </form>
</template>

<script>
export default {
    emits: ['add-contact'],
    data() {
        return {
            inputName: "",
            inputEmail: "",
        }
    },
    methods: {
        submitForm() {
            if (!this.inputName || !this.inputEmail) {
                alert('please enter name and email');
                return;
            }
            this.$emit('add-contact', this.inputName, this.inputEmail);
            this.inputName = '';
            this.inputEmail = '';
        }
    }
}
</script>
