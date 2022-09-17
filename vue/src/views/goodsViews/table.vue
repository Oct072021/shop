<template>
    <div class="table" style="width: 90%; margin-left: 5%">
        <div class="search" style="display:flex;">
            <h3 style="width: 200px;float: left;font-size: 25px; color: #777; font-style:oblique">商品管理</h3>
            <el-form ref="form"
                     :rules="rules"
                     :model="pos"
                     label-width="20px"
                     style="margin-top:15px; display:flex;">
                <el-form-item style="width:200px;">
                    <el-input v-model="pos.title" placeholder="请输入商品的名字"/>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="pos.gId" placeholder="请选择商品类型" style="width: 144px;">
                        <div v-for="item in types">
                            <el-option :label="item.label" :value="item.typeNum"/>
                        </div>
                    </el-select>
                </el-form-item>
                <el-form-item style="width:300px;">
                    <el-col :span="8">
                        <el-input v-model.number="pos.minPrice" placeholder="最低价格" style="width:100px;"></el-input>
                    </el-col>
                    <el-col class="line" :span="4">¥---</el-col>
                    <el-col :span="8">
                        <el-input v-model.number="pos.maxPrice" placeholder="最高价格" style="width:100px;"></el-input>
                    </el-col>
                    <el-col class="line" :span="4">¥</el-col>
                </el-form-item>
                <el-form-item>
                    <el-switch
                            v-model="pos.onSale"
                            active-text="在售"
                            inactive-text="售完"
                            inactive-value="no"
                            active-value="yes">
                    </el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch('form')" style="width: 140px; height: 40px;">
                        <i class="el-icon-search"></i>
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-button type="primary"
                   @click="dialogFormVisible = true"
                   style="float:left;margin-top:-10px;margin-bottom: 10px;width: 120px;">
            <i class="el-icon-plus"></i>
            新建
        </el-button>

        <el-dialog title="添加商品" :visible.sync="dialogFormVisible" width="28%">
            <el-form ref="gfrom" :model="adg">
                <el-form-item label="商品名字:" style="width: 230px;">
                    <el-input v-model="adg.goodsName" placeholder="请输入商品的名字" style="width: 150px;"></el-input>
                </el-form-item>
                <el-form-item label="商品类型:" style="width:230px">
                    <el-select v-model="adg.goodsTypeId" placeholder="请选择商品类型" style="width: 150px;">
                        <div v-for="i in types">
                            <el-option :label="i.label" :value="i.typeNum"/>
                        </div>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品数量:" style="width:230px">
                    <el-input-number v-model="adg.count" :min="0" style="width: 150px;"/>
                </el-form-item>
                <el-form-item label="商品价格:" style="width: 230px">
                    <el-input v-model.number="adg.price" placeholder="请输入商品价格" style="width: 150px"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addGoods('form')">确 定</el-button>
                </el-form-item>
                <span>图片不能添加,默认图片, 大于零在售</span>
            </el-form>
        </el-dialog>

        <el-table v-loading="loading" :data="tableData" border height="522"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="selection" prop="goodsId" width="55"/>
            <el-table-column fixed="left" prop="goodsId" label="Id" sortable width="90"/>
            <el-table-column prop="goodsName" show-overflow-tooltip label="商品名称" width="140"/>
            <el-table-column prop="price" label="原价" width="80" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.price }}¥</span>
                </template>
            </el-table-column>
            <el-table-column prop="onSale" label="是否在售" width="80">
                <template slot-scope="scope">
                    <span :style="{ color: scope.row.onSale === 'yes' ? '#ff0000': '#808080'}">
                     {{ scope.row.onSale === 'yes' ? '在售' : '售完' }}
                     </span>
                </template>
            </el-table-column>
            <el-table-column prop="goodsImg" label="商品图片" width="120">
                <template slot-scope="scope">
                    <img :src="scope.row.goodsImg" style="height: 44px; border:1px solid red"/>
                </template>
            </el-table-column>
            <el-table-column label="库存" prop="count">
            </el-table-column>
            <el-table-column label="商品类型" prop="goodsType">
                <template slot-scope="scope">
                     <span v-for="g in scope.row.goodsType">
                        {{ g.goodsTypeName }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" @click="findByIdEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="delteById(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :page-size="size" :total="total"
                       @current-change="page">
        </el-pagination>
    </div>
</template>


<style>
    .el-table .warning-row {
        background: rgb(248, 230, 212);
    }

    .el-table .success-row {
        background: #add6fa;
    }
</style>


<script>
    export default {
        methods: {
            //查询商品
            onSearch(form) {
                let that = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        console.log(that.pos)
                        axios.post('http://localhost:8080/goods' + '/0' + '/' + this.size, that.pos)
                            .then(function (response) {
                                console.log(response.data)
                                if (response.data) {
                                    that.tableData = response.data.list
                                    that.total = response.data.num
                                    that.$message({
                                        message: '查询成功',
                                        type: 'success'
                                    });
                                }
                            })
                    }
                })
            },
            //添加商品
            addGoods(form) {
                let that = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        console.log(that.adg)
                        axios.put('http://localhost:8080/addGoods', that.adg).then(function (response) {
                            console.log(response.data)
                            if (response.data) {
                                that.$message({
                                    message: '添加商品成功',
                                    type: 'success'
                                });
                                location.reload()
                            } else {
                                that.$message.error('错了哦，添加商品数据失败');
                            }
                        })
                        that.dialogFormVisible = false
                    }
                })
            },

            //分页事件的处理
            page(currentPage) {
                let that = this
                axios.post('http://localhost:8080/goods/' + (currentPage - 1) + '/' + this.size, that.pos)
                    .then(function (response) {
                        console.log(response.data)
                        that.tableData = response.data.list
                    })
            },
            //编辑商品,利用路由映射地址转入目标页面并带上一个参数
            findByIdEdit(object) {
                this.$router.push('/edit?id=' + object.goodsId)
            },

            //删除商品
            delteById(object) {
                let that = this
                //弹出对话框
                this.$confirm('是否确定删除' + object.title + '?', '删除数据', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //向后端传数据并删除
                    axios.delete('http://localhost:8080/deleteGoods?id=' + object.goodsId)
                        .then(function (response) {
                            console.log(response.data)
                            //判断后端数据是否存在
                            if (response.data) {
                                that.$alert(object.name + '删除成功!', '删除数据', {
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

            }
        },

        //初始化数据
        created() {
            let that = this
            //得到后台传来的数据
            console.log('http://localhost:8080/goods' + '/0' + '/' + this.size, this.pos)
            axios.post('http://localhost:8080/goods' + '/0' + '/' + this.size, this.pos)
                .then(function (response) {
                    console.log(response.data)
                    if (response.data) {
                        that.tableData = response.data.list
                        console.log(that.tableData)
                        that.total = response.data.num
                        that.loading = false
                        that.$message({
                            message: '加载数据成功啦!',
                            type: 'success'
                        })
                    } else {
                        that.$message.error('错了哦，服务器与服务端丢失,请检查一下网络呀!')
                    }
                })
        },

        data() {
            return {
                dialogFormVisible: false,
                tableData: null,
                total: 0,
                size: 6,
                loading: true,
                pos: {
                    title: '',
                    gId: '',
                    minPrice: '',
                    maxPrice: '',
                    onSale: 'yes'
                },
                rules: {},
                adg: {
                    goodsName: '',
                    price: '',
                    count: 0,
                    goodsTypeId: ''
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
        }
    }
</script>