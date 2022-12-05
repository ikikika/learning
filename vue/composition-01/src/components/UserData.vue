<template>
    <h3>{{ userName }}</h3>
    <h3>{{ age }}</h3>
</template>

<script>
import {
    computed,
    inject,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted
} from 'vue';

export default {
    props: ['firstName', 'lastName'],
    setup(
        props,
        // context
    ) {
        const uName = computed(function () {
            return props.firstName + ' ' + props.lastName;
        });

        // context.emit('save-data', 1); // this.emit('save-data', 1)

        const age = inject('userAge'); // dun change injected values here. only change them at the place where they are provided

        onBeforeMount(function () {
            console.log('onBeforeMount');
            // before component mounted
        });
        onMounted(function () {
            console.log('onMounted');
            // component mounted
        });
        onBeforeUpdate(function () {
            console.log('onBeforeUpdate');
            // before copmponent updated
        });
        onUpdated(function () {
            console.log('onUpdated');
            // after component updated
        });
        onBeforeUnmount(function () {
            console.log('onBeforeUnmount');
        });
        onUnmounted(function () {
            console.log('onUnmounted');
        });

        return { userName: uName, age }
    }
}
</script>