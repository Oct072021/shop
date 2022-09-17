<template>
    <div>{{ admin.userName }}</div>
</template>
<script>
    export default {
        data() {
            return {
                admin: ''
            }
        },
        created() {
            this.admin = JSON.parse(window.localStorage.getItem('accese-usename'))
        },
        methods: {
            ad() {
                console.log(JSON.parse(window.localStorage.getItem('accese-usename')))
            }
        }
    }
</script>
