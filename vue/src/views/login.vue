<template>
    <div class="userLogin">
        <img src="/images/4.jpg" class="bgimg"/>

        <div class="loginFrom">
            <div class="loginElect">
                <p id="phoneLogin" @click="show(1)"><span>用户登录</span></p>
                <p id="EmailLogin" @click="show()"><span>邮箱辅助</span></p>
            </div>

            <div class="verifyFrom">
                <div id="UsephoneLogin">
                    <el-form ref="form" status-icon :rules="phoneRules" :model="user">
                        <el-form-item prop="phone">
                            <el-input
                                    v-model.number="user.phone"
                                    placeholder="请输入手机号码"
                                    prefix-icon="el-icon-mobile-phone"
                                    style="width: 300px"
                            ></el-input>
                        </el-form-item>

                        <el-form-item prop="password">
                            <el-input
                                    v-model="user.password"
                                    placeholder="请输入密码"
                                    show-password
                                    prefix-icon="el-icon-key"
                                    style="width: 300px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                    type="primary"
                                    @click="onSubmit('form')"
                                    class="BtAction"
                            >登录
                            </el-button
                            >
                        </el-form-item>
                        <el-button class="BtAction">注册</el-button>
                    </el-form>
                </div>

                <div id="UseEmailLogin">
                    <el-form
                            ref="Emailform"
                            status-icon
                            :rules="EmailRules"
                            :model="email"
                    >
                        <el-form-item prop="mail">
                            <el-input
                                    prefix-icon="el-icon-message"
                                    v-model="email.mail"
                                    placeholder="请输入你的邮箱"
                                    style="width: 300px; border: 0"
                            >
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="verifyCode">
                            <el-input
                                    prefix-icon="el-icon-s-comment"
                                    v-model="email.verifyCode"
                                    placeholder="请输入你的验证码"
                                    style="width: 180px"
                            >
                            </el-input>
                            <el-button
                                    type="primary"
                                    style="margin-left: 27px; width: 89px"
                                    @click="sendCode()"
                                    id="BtSend"
                            >发送
                            </el-button
                            >
                        </el-form-item>

                        <el-form-item>
                            <el-button
                                    type="primary"
                                    @click="EmailSubmit('Emailform')"
                                    class="BtAction"
                            >登录
                            </el-button
                            >
                        </el-form-item>
                        <el-button class="BtAction">注册</el-button>
                    </el-form>
                </div>

                <a class="forget">忘记密码</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                //用户使用手机号码登录时数据验证
                user: {
                    phone: "",
                    password: "",
                },
                phoneRules: {
                    phone: [
                        {required: true, message: "  ", trigger: "blur"},
                        {type: "number", message: "非法字符"},
                    ],
                    password: [{required: true, message: "  ", trigger: "blur"}],
                },

                //邮箱验证的数据验证
                email: {
                    mail: "",
                },
                EmailRules: {
                    mail: [{required: true, message: "  ", trigger: "blur"},
                        {type: 'email', message: '请输入正确的邮箱地址'}],
                    verifyCode: [{
                        required: true, message: "  ", trigger: "blur"
                    }]
                },
                mailCode: ""
            };
        },
        methods: {
            //切换登录方式
            show(num) {
                //得到页面中的所需要的元素
                let phone = document.getElementById("UsephoneLogin").style;
                let mail = document.getElementById("UseEmailLogin").style;
                let ElectPhone = document.getElementById("phoneLogin").style;
                let ElectMail = document.getElementById("EmailLogin").style;
                //如果方法中的num为1则显示手机登录模式, 如果不等于1则显示邮箱登录模式
                if (num == 1) {
                    //css样式的改变
                    mail.display = "none";
                    phone.display = "block";
                    ElectPhone.backgroundColor = "#409EFF";
                    ElectPhone.color = "black";
                    ElectMail.backgroundColor = "white";
                    ElectMail.color = "#808080";
                } else {
                    mail.display = "block";
                    phone.display = "none";
                    ElectPhone.backgroundColor = "white";
                    ElectPhone.color = "#808080";
                    ElectMail.backgroundColor = "#409EFF";
                    ElectMail.color = "black";
                }
            },

            //Phone 和 密码登录
            onSubmit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let that = this;
                        axios
                            .get("http://localhost:8080/UsePhoneLogin", {params: this.user})
                            .then(function (response) {
                                console.log(response.data)
                                if (response.data != null) {
                                    localStorage.setItem("accese-usename", JSON.stringify(response.data))
                                    that.$router.replace({path: '/home'})
                                }
                            });
                    }
                });
            },

            //异步发送邮件
            sendCode() {
                let BtSend = document.getElementById("BtSend");
                let mail = this.email.mail;
                let wait = 120;
                let that = this;
                if (mail.length > 0) {
                    if (BtSend.innerText == "发送") {
                        axios.get('http://localhost:8080/sendMail?mail=' + mail).then(function (response) {
                            if (response.data) {
                                that.mailCode = response.data;
                                alert(that.mailCode);
                            } else {
                                alert("发送失败了,请检查网络是否连通");
                            }
                        })

                        function countTime() {
                            wait--;
                            BtSend.innerText = wait + '秒';
                            if (wait == -1) {
                                clearInterval(stop);
                                BtSend.innerText = "发送";
                                that.mailCode = "";
                                alert(that.mailCode);
                            }
                        }

                        let stop = setInterval(countTime, 1000);
                    }
                }
            },

            //使用邮箱和验证码辅助登录
            EmailSubmit(Emailform) {
                let that = this;
                let mail = this.email.mail;
                let code = this.mailCode;
                axios.get('http://localhost:8080/sendMail?mail=' + mail).then(function (response) {
                    if (response.data) {
                        if (that.email.verifyCode == code) {
                            that.$router.push("/home");
                        }
                    }
                })
            }
        },
    }
</script>


<style>
    .userLogin {
        width: 100%;
        height: 100%;
    }

    .bgimg {
        width: 100%;
        height: 105%;
        position: relative;
    }

    .loginFrom {
        top: 50%;
        left: 50%;
        width: 400px;
        height: 400px;
        position: absolute;
        border-radius: 13px;
        -webkit-transform: translate(-50%, -50%);
        background-color: white;
    }

    .loginElect {
        display: flex;
        height: 70px;
        border-bottom: 1px solid #808080;
        border-radius: 13px 13px 0px 0px;
    }

    .loginElect p {
        width: 200px;
        height: 70px;
        font-size: 20px;
        margin-top: 0px;
    }

    .loginElect #phoneLogin {
        background-color: #409eff;
        border-right: 1px solid #808080;
        border-radius: 13px 0px 0px 0px;
    }

    .loginElect #EmailLogin {
        color: #c0c4cc;
        border-radius: 0px 13px 0px 0px;
    }

    .loginElect p span {
        line-height: 70px;
    }

    .loginElect p:hover {
        cursor: pointer;
    }

    .verifyFrom {
        width: 100%;
        height: 430px;
        margin-top: 40px;
    }

    .BtAction {
        width: 200px;
    }

    .verifyFrom .forget {
        float: left;
        color: #808080;
        margin-top: 30px;
    }

    .verifyFrom .forget:hover {
        color: #e6a23c;
        cursor: pointer;
    }

    .verifyFrom #UsephoneLogin {
        width: 100%;
        height: 229px;
        display: block;
    }

    .verifyFrom #UseEmailLogin {
        width: 100%;
        height: 229px;
        display: none;
    }

    .el-form-item__error {
        margin-left: 120px;
    }
</style>