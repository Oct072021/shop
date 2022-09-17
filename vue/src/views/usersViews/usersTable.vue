<template>
    <div class="table" style="width: 90%; margin-left: 5%">
        <div class="search" style="display:flex;">
            <h3 style="width: 200px;float: left;font-size: 25px; color: #777; font-style:oblique">用户管理</h3>

            <el-form
                    ref="form"
                    :rules="rules"
                    :model="user"
                    label-width="40px"
                    style="margin-top:55px; display:flex;"
            >

                <el-form-item style="width:400px;">
                    <el-input v-model="user.userName" placeholder="请输入用户的名字"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSearchUser('form')" style="width: 140px; height: 40px;"><i
                            class="el-icon-search"></i>查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-button type="primary"
                   @click="dialogFormVisible = true"
                   style="float:left;margin-top:-10px;margin-bottom: 10px;width: 120px;">
            <i class="el-icon-plus"></i>新建
        </el-button>

        <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="28%">
            <el-form ref="gfrom" :model="adu">

                <el-form-item label="用户名称" style="width: 230px;">
                    <el-input v-model="adu.userName" placeholder="请输入用户名称" style="width: 150px;"></el-input>
                </el-form-item>

                <el-form-item label="手机号码" style="width: 230px;">
                    <el-input v-model="adu.phone" placeholder="请输入用户的电话号码" style="width: 150px;"></el-input>
                </el-form-item>

                <el-form-item label="用户密码" style="width: 230px;">
                    <el-input v-model="adu.password" placeholder="请设置用户的密码" style="width: 150px;"></el-input>
                </el-form-item>

                <el-form-item label="用户邮箱" style="width: 270px;">
                    <el-input v-model="adu.userEmail" placeholder="请设置用户的邮箱" style="width: 190px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser('form')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="修改用户" :visible.sync="edituser" width="28%">
            <el-form ref="eufrom" :model="edu">
                <el-form-item label="用户名称" style="width: 230px;">
                    <el-input v-model="edu.userName" placeholder="请输入用户名称" style="width: 150px;"></el-input>
                </el-form-item>

                <el-form-item label="手机号码" style="width: 230px;">
                    <el-input v-model="edu.phone" placeholder="请输入用户的电话号码" style="width: 150px;"></el-input>
                </el-form-item>

                <el-form-item label="用户密码" style="width: 230px;">
                    <el-input v-model="edu.password" placeholder="请设置用户的密码" style="width: 150px;"></el-input>
                </el-form-item>

                <el-form-item label="用户邮箱" style="width: 270px;">
                    <el-input v-model="edu.userEmail" placeholder="请设置用户的邮箱" style="width: 190px;"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="EditUser('form')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :data="tableData"
                style="width: 100%"
                border
                height="480"
        >
            <el-table-column
                    prop="userId"
                    label="用户Id"
                    width="90"
            >
            </el-table-column>

            <el-table-column
                    prop="userName"
                    show-overflow-tooltip
                    label="用户姓名"
            >
            </el-table-column>

            <el-table-column
                    prop="phone"
                    label="手机号码"
                    width="130"
            >
            </el-table-column>

            <el-table-column
                    prop="password"
                    label="密码"
                    width="80"
            >
            </el-table-column>

            <el-table-column
                    prop="userEmail"
                    label="用户邮箱"
                    width="140"
                    show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
                    label="注册时间"
                    prop="signInData"
                    show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="150"
                    fixed="right"
            >
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="findByIdEdit(scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="delteById(scope.row)">删除
                    </el-button>
                </template>

            </el-table-column>

        </el-table>

        <el-pagination
                background
                layout="prev, pager, next"
                :page-size="size"
                :total="total"
                @current-change="page">
        </el-pagination>

    </div>
</template>
<script>
    export default {
        //定义数据格式
        data() {
            return {
                tableData: null,
                edituser: false,
                dialogFormVisible: false,
                total: 0,
                size: 8,
                loading: true,
                user: {
                    userName: '',
                },
                rules: {},
                adu: {
                    userName: '',
                    phone: '',
                    userEmail: '',
                    password: ''
                },
                edu: {
                    userId: '',
                    userName: '',
                    phone: '',
                    userEmail: '',
                    password: ''
                }
            }
        },
        //初始化数据,渲染视图
        created() {
            let _this = this
            axios.post('http://localhost:8080/findUserAll' + '/0' + '/' + this.size, this.user).then(function (response) {
                if (response.data) {
                    _this.tableData = response.data.list
                    _this.total = response.data.num
                    _this.loading = false
                    _this.$message.success("加载数据成功啦!")
                } else {
                    _this.$message.error('错了哦，服务器与服务端丢失了呀!')
                }
            })
        },
        methods: {
            //查询用户
            onSearchUser(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        axios.post('http://localhost:8080/findUserAll' + '/0' + '/' + this.size, this.user)
                            .then(function (response) {
                                if (response.data) {
                                    _this.tableData = response.data.list
                                    _this.total = response.data.num
                                    _this.$message({
                                        message: '查询成功',
                                        type: 'success'
                                    });
                                } else {
                                    _this.$message.error('哎呀!服务器出现错了')
                                }
                            })
                    }
                })
            },
            //添加用户
            addUser(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        axios.put('http://localhost:8080/insertUser', this.adu)
                            .then(function (response) {
                                if (response.data) {
                                    _this.$message({
                                        message: '添加商品成功',
                                        type: 'success'
                                    });
                                    location.reload()
                                } else {
                                    _this.$message.error('哎呀!服务出现异常添加数据失败了')
                                }
                            })
                    }
                    _this.dialogFormVisible = false
                })
            },
            //分页
            page(currentPage) {
                let _this = this
                axios.post('http://localhost:8080/findUserAll/' + (currentPage - 1) + '/' + this.size, this.user)
                    .then(function (response) {
                        _this.tableData = response.data.list
                    })
            },
            //删除用户
            delteById(object) {
                let _this = this
                this.$confirm('是否确定删除' + object.userName + '?', '删除数据', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    //向后端传递数据并删除对应的数据
                    axios.delete('http://localhost:8080/deleteUserById?userId=' + object.userId).then(function (response) {
                        //判断后端是否存在
                        if (response.data) {
                            _this.$alert(object.userName + '删除成功!', '删除数据', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    location.reload()
                                }
                            })
                        }
                    })
                })
            },
            //查询出ID方便修改
            findByIdEdit(object) {
                let _this = this
                axios.get("http://localhost:8080/findById?userId=" + object.userId)
                    .then(function (response) {
                        if (response.data) {
                            _this.edu = response.data
                            _this.edituser = true
                            _this.$message({
                                message: '嗯呐!为你找到' + object.userName + '的详细信息',
                                type: 'success'
                            });
                        } else {
                            _this.$message.error('错了哦，添加用户数据失败')
                            _this.edituser = false
                        }
                    })
            },
            EditUser(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        axios.put("http://localhost:8080/eidtUserFindById", this.edu)
                            .then(function (response) {
                                if (response.data) {
                                    _this.$message({
                                        message: '嗯呐!修改数据成功了',
                                        type: 'success'
                                    })
                                    location.reload()
                                } else {
                                    _this.$message.error('错了哦，修改用户数据失败,请检查下手机或者邮箱')
                                }
                            })
                    }
                })
                _this.edituser = false
            }
        }
    }
</script>
