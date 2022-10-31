<template>
    <ul>
        <li :class="{ active: modelValue === 'poor' }">
            <button type="button" @click="activate('poor')">Poor</button>
        </li>
        <li :class="{ active: modelValue === 'average' }">
            <button type="button" @click="activate('average')">Average</button>
        </li>
        <li :class="{ active: modelValue === 'good' }">
            <button type="button" @click="activate('good')">Good</button>
        </li>
    </ul>
</template>

<script>
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    methods: {
        activate(option) {
            this.$emit('update:modelValue', option);
        }
    }
}
</script>

<style scoped>
.active {
    border-color: rgb(169, 25, 169);
}

.active button {
    color: rgb(169, 25, 169);
}

ul {
    list-style: none;
    margin: 0.5rem 0;
    padding: 0;
    display: flex;
}

li {
    margin: 0 1rem;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
}

button {
    font: inherit;
    border: none;
    padding: 5px;
    background-color: transparent;
    cursor: pointer;
}
</style>