<template>
    <ul>
        <user-info v-for="user in usersProvided" :key="user.id" :user-description="user" />
    </ul>

</template>

<script>
import UserInfo from "./UserInfo.vue"

export default {
    components: {
        UserInfo
    },
    inject: ['usersProvided'],
}
</script>