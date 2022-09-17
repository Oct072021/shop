<template>
    <div class="table" style="width: 90%; margin-left: 5%">
        <div class="search" style="display:flex;">
            <h3 style="width: 200px;float: left;font-size: 25px; color: #777; font-style:oblique">订单管理</h3>
            <el-form
                    ref="form"
                    :rules="rules"
                    :model="types"
                    label-width="40px"
                    style="margin-top:55px; display:flex;"
            >
                <el-form-item style="width:400px;">
                    <el-input v-model="types.goodsTypeName" placeholder="请输入类型名称"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSearchType('form')" style="width: 140px; height: 40px;"><i
                            class="el-icon-search"></i>查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>


        <el-button type="primary"
                   @click="ViewType()"
                   style="float:left;margin-top:-10px;margin-bottom: 10px;width: 120px;">
            <i class="el-icon-plus"></i>新建
        </el-button>


        <el-dialog title="添加用户" :visible.sync="viewTypes" width="28%">
            <el-form ref="gfrom" :model="typeName">
                <el-form-item style="width:400px;">
                    <el-input v-model="typeName.goodsTypeName" placeholder="请输入类型名称"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="ViewType = false">取 消</el-button>
                    <el-button type="primary" @click="addType('form')">确 定</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

        <el-dialog title="添加用户" :visible.sync="typeEdit" width="28%">
            <el-form ref="gfrom" :model="typeName">
                <el-form-item style="width:400px;">
                    <el-input v-model="typeName.goodsTypeName" placeholder="请输入类型名称"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="typeEdit = false">取 消</el-button>
                    <el-button type="primary" @click="udpateType('form')">确 定</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

        <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :data="tableData"
                border
                height="525"
        >
            <el-table-column
                    prop="goodsTypeId"
                    label="类型编号">
            </el-table-column>

            <el-table-column
                    prop="goodsTypeName"
                    label="类型编号">
            </el-table-column>


            <el-table-column
                    label="操作"
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
        data() {
            return {
                tableData: null,
                loading: true,
                viewTypes: false,
                typeEdit: false,
                total: 0,
                size: 9,
                types: {
                    goodsTypeName: ''
                },
                typeName: {
                    goodsTypeName: ''
                }
            }
        },
        created() {
            let _this = this
            axios.post('http://localhost:8080/TypeAll' + '/0' + '/' + this.size, this.types)
                .then(function (response) {
                    if (response.data) {
                        _this.tableData = response.data.list
                        _this.total = response.data.num
                        _this.loading = false
                        _this.$message({
                            message: '加载数据成功啦!',
                            type: 'success'
                        })
                    } else {
                        _this.$message.error('错了哦，服务器与服务端丢失,请检查一下网络呀!')
                    }
                })
        },
        methods: {
            //分页事件的处理
            page(currentPage) {
                let _this = this
                axios.post('http://localhost:8080/TypeAll/' + (currentPage - 1) + '/' + this.size, _this.types).then(function (response) {
                    _this.tableData = response.data.list
                })
            },
            onSearchType(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    console.log(this.shops)
                    axios.post("http://localhost:8080/TypeAll/" + '0' + '/' + this.size, this.types)
                        .then(function (response) {
                            _this.tableData = response.data.list
                            _this.total = response.num
                            _this.$message({
                                message: '成功为您查询到以下数据啦!',
                                type: 'success'
                            });
                        })
                })
            },
            ViewType() {
                this.viewTypes = true
                this.types = this.$options.data().types
            },
            addType(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    axios.put("http://localhost:8080/addType", this.typeName)
                        .then(function (response) {
                            if (response.data) {
                                _this.$message({
                                    message: '添加成功啦!',
                                    type: 'success'
                                })
                                location.reload()
                            } else {
                                _this.$message.error('错了哦，添加数据失败');
                            }
                        })
                })
                _this.dialogshop = false
            },
            //删除购物车
            delteById(object) {
                let _this = this
                //弹出对话框
                this.$confirm('是否确定删除' + object.title + '?', '删除数据', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //向后端传数据并删除
                    axios.delete('http://localhost:8080/deleteType?id=' + object.goodsTypeId).then(function (response) {
                        //判断后端数据是否存在
                        if (response.data) {
                            _this.$alert(object.name + '删除成功!', '删除数据', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    //重载界面,刷新页面数据
                                    location.reload()
                                }
                            })
                        }
                    })
                }).catch(() => {
                });
            },
            findByIdEdit(object) {
                let _this = this
                this.typeName = this.$options.data().typeName
                this.typeEdit = true
                axios.get("http://localhost:8080/findByIdType?id=" + object.goodsTypeId)
                    .then(function (response) {
                        if (response.data) {
                            _this.typeName = response.data
                        } else {
                            _this.$message.error('错了哦，丢失数据');
                        }
                    })
            },
            udpateType(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        axios.put("http://localhost:8080/updateType", this.typeName)
                            .then(function (response) {
                                if (response.data) {
                                    _this.$message({
                                        message: '修改成功啦!',
                                        type: 'success'
                                    })
                                    location.reload()
                                } else {
                                    _this.$message.error('错了哦');
                                }

                            })
                    }
                    this.typeEdit = false
                })
            }
        }
    }
</script>