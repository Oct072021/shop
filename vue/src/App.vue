<template>
    <div id="app">
        <div id="topMenu" v-if="!$route.meta.showMenu">
            <div class="tilte">在线商城管理系统V2.0</div>
            <div class="tilteRight">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-chat-dot-square"></i>&nbsp;
                        我的消息
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <i class="el-icon-user"></i>&nbsp;
                            欢迎:&nbsp;&nbsp;
                            <span>{{ admin.userName }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                            <i class="el-icon-platform-eleme"></i>&nbsp;
                            退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-user-solid"></i>&nbsp;
                        我的信息
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <i class="el-icon-user"></i>&nbsp;
                            欢迎:&nbsp;&nbsp;
                            <span>{{ admin.userName }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                            <span @click="logout()">
                                <i class="el-icon-platform-eleme"></i>&nbsp;
                                退出登录
                            </span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div id="homes">
            <el-menu
                    :default-active="$route.path"
                    router
                    id="leftMenu"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#f8f8f8"
                    text-color="#303133"
                    active-text-color="#409EFF"
                    v-if="!$route.meta.showMenu">
                <el-menu-item v-for="item in urlArr" :index="item.path">
                    <i :class="item.icon"></i>
                    <span>{{ item.urlItem }}</span>
                </el-menu-item>
            </el-menu>
            <div id="table" style="width: 100%;">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                urlArr: [
                    {path: "/home", urlItem: "后台主页", icon: "el-icon-s-home"},
                    {path: "/user", urlItem: "用户管理", icon: "el-icon-user-solid"},
                    {path: "/table", urlItem: "商品管理", icon: "el-icon-present"},
                    {path: "/goodsType", urlItem: "类型管理", icon: "el-icon-help"},
                    {path: "/order", urlItem: "订单管理", icon: "el-icon-sell"},
                    {path: "/shop", urlItem: "购物管理", icon: "el-icon-shopping-cart-full"},
                    {path: "/pie", urlItem: "饼状图", icon: "el-icon-picture-outline-round"},
                ],
                drawer: true,
                admin: ''
            };
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            logout() {
                let that = this
                this.$confirm("是否退出登录", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: '取消'
                }).then((response) => {
                    localStorage.removeItem("accese-usename")
                    that.$router.replace({path: '/'})
                })
            }
        },
        beforeUpdate() {
            this.admin = JSON.parse(localStorage.getItem('accese-usename'))
        },
    };
</script>


<style>
    html, body, #app {
        margin: 0px;
        padding: 0px;
        text-align: center;
        width: 100%;
        height: 100%;
        background-color: #FFFFFF;
    }

    #homes {
        width: 100%;
        height: 100%;
        display: flex;
    }

    #leftMenu {
        width: 15%;
        height: 90%;

    }

    #topMenu {
        width: 100%;
        height: 10%;
        background-color: #f8f8f8;
        border-bottom: 3px solid #ECEEF1;
    }

    .tilte {
        color: #777;
        float: left;
        font-size: 20px;
        padding: 20px 20px;
    }

    .tilteRight {
        float: right;
        display: flex;
        color: black;
    }

    .el-dropdown-link {
        padding-left: 45px;
        color: black;
        font-size: 18px;
        line-height: 60px;
    }

    .el-dropdown-link:hover {
        color: #409EFF;
        cursor: pointer
    }

    .el-icon-arrow-down {
        font-size: 18px;
    }
</style>
