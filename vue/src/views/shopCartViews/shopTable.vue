<template>
    <div class="table" style="width: 90%; margin-left: 5%">
        <div class="search" style="display:flex;">
            <h3 style="width: 200px;float: left;font-size: 25px; color: #777; font-style:oblique">购物车管理</h3>
            <el-form
                    ref="form"
                    :model="shops"
                    label-width="15px"
                    style="margin-top:15px; display:flex;"
            >
                <el-form-item>
                    <el-input v-model="shops.userName" placeholder="请输入用户名字"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-select v-model="shops.goodsTypeId" placeholder="请选择商品类型" style="width: 144px;">
                        <div v-for="i in types">
                            <el-option :label="i.label" :value="i.typeNum"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="shops.goodsName" placeholder="请输入商品名字"></el-input>
                </el-form-item>

                <el-form-item style="width:300px;">
                    <el-col :span="8">
                        <el-input v-model.number="shops.minPrice" placeholder="最低价格" style="width:100px;"></el-input>
                    </el-col>
                    <el-col class="line" :span="4">¥---</el-col>
                    <el-col :span="8">
                        <el-input v-model.number="shops.maxPrice" placeholder="最高价格" style="width:100px;"></el-input>
                    </el-col>
                    <el-col class="line" :span="4">¥</el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearchShop('form')" style="width: 140px; height: 40px;"><i
                            class="el-icon-search"></i>查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-button type="primary"
                   @click="addShopView()"
                   style="float:left;margin-top:-10px;margin-bottom: 10px;width: 120px;">
            <i class="el-icon-plus"></i>新建
        </el-button>


        <el-dialog title="添加购物车" :visible.sync="dialogshop" width="28%">
            <el-form ref="sfrom" :model="shopa">
                <el-form-item label="选择用户" style="width:230px">
                    <el-select v-model="shopa.userId" placeholder="请选择用户" style="width: 150px;"
                               @visible-change="whereUser()">
                        <div v-for="i in users">
                            <el-option :label="i.userName" :value="i.userId"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择商品" style="width:230px">
                    <el-select v-model="shopa.goodsId" placeholder="请选择用户" style="width: 150px;"
                               @visible-change="whereGoods()">
                        <div v-for="i in goods">
                            <el-option :label="i.goodsName" :value="i.goodsId"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品数量:" style="width:230px">
                    <el-input-number v-model="shopa.count" :min="0" style="width: 150px;"></el-input-number>
                </el-form-item>

                <el-form-item>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addShop('form')">确 定</el-button>
                </el-form-item>
                <span>购物车中不扣除商品库存数量,只显示该订单价格</span>
            </el-form>
        </el-dialog>


        <el-dialog title="修改购物车" :visible.sync="editshop" width="28%">
            <el-form ref="sfrom" :model="shopa">
                <el-form-item label="选择用户" style="width:230px">
                    <el-select v-model="shopa.userId" placeholder="请选择用户" style="width: 150px;"
                               @visible-change="whereUser()">
                        <div v-for="i in users">
                            <el-option :label="i.userName" :value="i.userId"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择商品" style="width:230px">
                    <el-select v-model="shopa.goodsId" placeholder="请选择用户" style="width: 150px;"
                               @visible-change="whereGoods()">
                        <div v-for="i in goods">
                            <el-option :label="i.goodsName" :value="i.goodsId"></el-option>
                        </div>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品数量:" style="width:230px">
                    <el-input-number v-model="shopa.count" :min="0" style="width: 150px;"></el-input-number>
                </el-form-item>

                <el-form-item>
                    <el-button @click="editshop = false">取 消</el-button>
                    <el-button type="primary" @click="editShop('form')">确 定</el-button>
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
                height="545"
        >
            <el-table-column
                    fixed="left"
                    prop="shopCartId"
                    label="购物车编号"
                    width="90">
            </el-table-column>

            <el-table-column
                    prop="count"
                    show-overflow-tooltip
                    label="购买数量"
            >
            </el-table-column>

            <el-table-column
                    prop="shopPrice"
                    show-overflow-tooltip
                    label="订单价格"
            >
            </el-table-column>

            <el-table-column
                    prop="usesList"
                    label="用户名"
                    width="80"
            >
                <template slot-scope="scope">
                <span v-for="u in scope.row.usersList">
                    {{ u.userName }}
                </span>
                </template>
            </el-table-column>

            <el-table-column
                    prop="usersList"
                    label="联系方式"
                    width="130"
            >
                <template slot-scope="scope">
                    <span v-for="u in scope.row.usersList">
                        {{ u.phone }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column
                    prop="goodsList"
                    label="商品图片"
                    width="120"
            >
                <template slot-scope="scope">
                    <span v-for="g in scope.row.goodsList">
                        <img :src="g.goodsImg" style="height: 44px; border:1px solid red"/>
                    </span>
                </template>
            </el-table-column>

            <el-table-column
                    label="商品名称"
                    prop="goodsList"
            >
                <template slot-scope="scope">
                    <span v-for="g in scope.row.goodsList">
                        {{ g.goodsName }}
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
                    label="库存"
                    prop="goodsList"
            >
                <template slot-scope="scope">
                    <span v-for="g in scope.row.goodsList">
                            {{ g.count }}
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
                dialogshop: false,
                editshop: false,
                total: 0,
                size: 6,
                shops: {
                    userName: '',
                    goodsName: '',
                    minPrice: '',
                    maxPrice: '',
                    goodsTypeId: ''
                },
                shopa: {
                    userId: '',
                    goodsId: '',
                    count: ''
                },
                users: {
                    userId: '',
                    userName: ''
                },
                goods: {
                    goodsId: '',
                    goodsName: '',
                    price: '',
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
                ]
            }
        },
        created() {
            let _this = this
            axios.post('http://localhost:8080/shopCart' + '/0' + '/' + this.size, this.shops).then(function (response) {
                if (response.data) {
                    console.log(response.data)
                    _this.tableData = response.data.list
                    _this.total = response.data.num
                    _this.loading = false
                    _this.$message({
                        message: '加载数据成功啦!',
                        type: 'success'
                    });
                } else {
                    _this.$message.error('错了哦，服务器与服务端丢失,请检查一下网络呀!');
                }
            })
        },
        methods: {
            //分页事件的处理
            page(currentPage) {
                let _this = this
                axios.post('http://localhost:8080/shopCart/' + (currentPage - 1) + '/' + this.size, _this.shops).then(function (response) {
                    _this.tableData = response.data.list
                })
            },

            //查询
            onSearchShop(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    console.log(this.shops)
                    axios.post("http://localhost:8080/shopCart/" + '0' + '/' + this.size, this.shops)
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
            //初始添加数据
            addShopView() {
                this.dialogshop = true
                this.shopa = this.$options.data().shopa
            },
            //添加购物车中的数据
            addShop(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        axios.put("http://localhost:8080/addShop", this.shopa)
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
                    axios.delete('http://localhost:8080/deleteShopCart?id=' + object.shopCartId).then(function (response) {
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
            //编辑购物车
            findByIdEdit(object) {
                let _this = this
                this.shopa = this.$options.data().shopa
                this.editshop = true
                axios.get("http://localhost:8080/shopCartById?id=" + object.shopCartId)
                    .then(function (response) {
                        if (response.data) {
                            _this.shopa = response.data
                        } else {
                            _this.$message.error('错了哦，丢失数据');
                        }
                    })
            },
            editShop(form) {
                let _this = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        axios.put("http://localhost:8080/updateShopCartId", this.shopa)
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
                    this.editshop = false
                })
            }
        }
    }
</script>