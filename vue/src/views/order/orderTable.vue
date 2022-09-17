<template>
    <div class="table" style="width: 90%; margin-left: 5%">
        <div class="search" style="display:flex;">
            <h3 style="width: 200px;float: left;font-size: 25px; color: #777; font-style:oblique">订单管理</h3>
            <el-form
                    ref="form"
                    :model="serch"
                    label-width="15px"
                    style="margin-top:15px; display:flex;"
            >
                <el-form-item>
                    <el-input v-model="serch.userName" placeholder="请输入用户名字"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-select v-model="serch.goodsTypeId" placeholder="请选择商品类型" style="width: 144px;">
                        <div v-for="i in types">
                            <el-option :label="i.label" :value="i.typeNum"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="serch.goodsName" placeholder="请输入商品名字"></el-input>
                </el-form-item>

                <el-form-item style="width:300px;">
                    <el-col :span="8">
                        <el-input v-model.number="serch.minPrice" placeholder="最低价格" style="width:100px;"></el-input>
                    </el-col>
                    <el-col class="line" :span="4">¥---</el-col>
                    <el-col :span="8">
                        <el-input v-model.number="serch.maxPrice" placeholder="最高价格" style="width:100px;"></el-input>
                    </el-col>
                    <el-col class="line" :span="4">¥</el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearchOrder('form')" style="width: 140px; height: 40px;"><i
                            class="el-icon-search"></i>查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>


        <el-button type="primary"
                   @click="addOrderView()"
                   style="float:left;margin-top:-10px;margin-bottom: 10px;width: 120px;">
            <i class="el-icon-plus"></i>新建
        </el-button>

        <el-dialog title="添加订单" :visible.sync="dialogOrder" width="28%">
            <el-form ref="sfrom" :model="order">
                <el-form-item label="选择用户:" style="width:230px">
                    <el-select v-model="order.userId" placeholder="请选择用户" style="width: 150px;"
                               @visible-change="whereUser()">
                        <div v-for="i in users">
                            <el-option :label="i.userName" :value="i.userId"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择商品:" style="width:230px">
                    <el-select v-model="order.goodsId" placeholder="请选择用户" style="width: 150px;"
                               @visible-change="whereGoods()">
                        <div v-for="i in goods">
                            <el-option :label="i.goodsName" :value="i.goodsId"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品数量:" style="width:230px">
                    <el-input-number v-model="order.orderCount" :min="0" style="width: 150px;"></el-input-number>
                </el-form-item>

                <el-form-item label="订单地址:" style="width:230px">
                    <el-input v-model="order.orderAddress" placeholder="输入地址" style="width: 150px;"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="dialogOrder = false">取 消</el-button>
                    <el-button type="primary" @click="addOrder('form')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <el-dialog title="添加订单" :visible.sync="dialogedit" width="28%">
            <el-form ref="ofrom" :model="order">
                <el-form-item label="选择用户:" style="width:230px">
                    <el-select v-model="order.userId" placeholder="请选择用户" style="width: 150px;"
                               @visible-change="whereUser()">
                        <div v-for="i in users">
                            <el-option :label="i.userName" :value="i.userId"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择商品:" style="width:230px">
                    <el-select v-model="order.goodsId" placeholder="请选择用户" style="width: 150px;"
                               @visible-change="whereGoods()">
                        <div v-for="i in goods">
                            <el-option :label="i.goodsName" :value="i.goodsId"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品数量:" style="width:230px">
                    <el-input-number v-model="order.orderCount" :min="0" style="width: 150px;"></el-input-number>
                </el-form-item>

                <el-form-item label="订单地址:" style="width:230px">
                    <el-input v-model="order.orderAddress" placeholder="输入地址" style="width: 150px;"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="dialogedit = false">取 消</el-button>
                    <el-button type="primary" @click="updateOrder('form')">确 定</el-button>
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
                    label="订单编号"
                    prop="orderId"
                    fixed="left"
            >
            </el-table-column>
            <el-table-column
                    label="订单数量"
                    prop="orderCount"
            >
            </el-table-column>

            <el-table-column
                    label="订单总价"
                    prop="orderPrice"
            >
            </el-table-column>

            <el-table-column
                    label="用户地址"
                    prop="orderAddress"
            >
            </el-table-column>

            <el-table-column
                    label="所属用户"
                    prop="usersList"
            >
                <template slot-scope="scope">
                <span v-for="u in scope.row.usersList">
                    {{ u.userName }}
                </span>
                </template>
            </el-table-column>

            <el-table-column
                    label="联系方式"
                    prop="usersList"
            >
                <template slot-scope="scope">
                    <span v-for="u in scope.row.usersList">
                        {{ u.phone }}
                    </span>
                </template>
            </el-table-column>


            <el-table-column
                    label="商品名字"
                    prop="goodsList"
            >
                <template slot-scope="scope">
                    <span v-for="g in scope.row.goodsList">
                        {{ g.goodsName }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column
                    label="商品图片"
                    prop="goodsList"
            >
                <template slot-scope="scope">
                    <span v-for="g in scope.row.goodsList">
                        <img :src="g.goodsImg" style="height: 44px; border:1px solid red"/>
                    </span>
                </template>
            </el-table-column>


            <el-table-column
                    label="商品价格"
                    prop="goodsList"
            >
                <template slot-scope="scope">
                    <span v-for="g in scope.row.goodsList">
                        {{ g.price }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column
                    label="是否在售"
                    prop="goodsList"
            >
                <template slot-scope="scope">
                    <p v-for="g in scope.row.goodsList">
                        <span
                                :style="{ color: g.onSale === 'yes' ? '#ff0000': '#808080'}">
                        {{ g.onSale === 'yes' ? '在售' : '售完' }}
                        </span>
                    </p>
                </template>
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
        data() {
            return {
                tableData: null,
                loading: true,
                total: 0,
                size: 6,
                dialogOrder: false,
                dialogedit: false,
                serch: {
                    userName: '',
                    goodsName: '',
                    minPrice: '',
                    maxPrice: '',
                    goodsTypeId: ''
                },
                order: {
                    orderAddress: '',
                    orderCount: '',
                    userId: '',
                    goodsId: ''
                },
                types: [
                    {label: "请选择", typeNum: ""},
                    {label: "数码产品", typeNum: 1},
                    {label: "生活用品", typeNum: 2},
                    {label: "衣装服饰", typeNum: 3},
                    {label: "医药保健", typeNum: 4},
                    {label: "图书文娱", typeNum: 5},
                    {label: "食品饮料", typeNum: 6},
                    {label: "水果蔬菜", typeNum: 7},
                    {label: "线上充值", typeNum: 8}
                ],
                users: {
                    userId: '',
                    userName: ''
                },
                goods: {
                    goodsId: '',
                    goodsName: '',
                    price: '',
                }
            }
        },
        created() {
            let _this = this
            axios.post('http://localhost:8080/findOrder' + '/0' + '/' + this.size, this.order)
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
                        _this.$message.error('错了哦，服务器与服务端丢失,请检查一下网络呀!');
                    }
                })
        },
        methods: {
            //分页事件的处理
            page(currentPage) {
                let _this = this
                axios.post('http://localhost:8080/findOrder/' + (currentPage - 1) + '/' + this.size, _this.serch)
                    .then(function (response) {
                        _this.tableData = response.data.list
                    })
            },
            //查询
            onSearchOrder(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    console.log(this.shops)
                    axios.post("http://localhost:8080/findOrder/" + '0' + '/' + this.size, this.serch)
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
            //选择列表中显示用户
            whereGoods() {
                let _this = this
                this.users = this.$options.data().users
                axios.get("http://localhost:8080/whereGoods").then(function (response) {
                    if (response.data) {
                        _this.goods = response.data
                    }
                })
            },
            //选择列表中显示商品列表
            whereUser() {
                let _this = this
                this.goods = this.$options.data().goods
                axios.get("http://localhost:8080/whereUser").then(function (response) {
                    if (response.data) {
                        _this.users = response.data
                    }
                })
            },
            addOrderView() {
                //打开对话框,数据初始化
                this.dialogOrder = true
                this.serch = this.$options.data().serch
                this.order = this.$options.data().order
            },
            addOrder(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        axios.put("http://localhost:8080/addOrder", this.order)
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
                    }
                    _this.dialogshop = false
                })
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
                    axios.delete('http://localhost:8080/deleteOrder?id=' + object.orderId).then(function (response) {
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
                this.order = this.$options.data().order
                this.dialogedit = true
                axios.get("http://localhost:8080/OrderById?id=" + object.orderId)
                    .then(function (response) {
                        if (response.data) {
                            _this.order = response.data
                        } else {
                            _this.$message.error('错了哦，丢失数据');
                        }
                    })
            },
            updateOrder(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        axios.put("http://localhost:8080/updateOrderById", this.order)
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
                    this.dialogedit = false
                })
            }
        }
    }
</script>