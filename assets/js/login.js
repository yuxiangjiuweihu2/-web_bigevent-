$(function () {

    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 获取form对象
    var form = layui.form
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });
    // 提交注册表单，发起ajax请求
    var layer = layui.layer
    $("#form_reg").on('submit', function (e) {
        e.preventDefault();
        $.post({
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功，请登录')
                // 模拟人点击‘去登录’
                $('#link_login').click();

            }

        })
    });
    // 登录提交表单
    $('#from_login').on('submit', function (e) {
        e.preventDefault();
        $.post({
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                localStorage.setItem('token', res.token)
                location.href = "index.html"
            }
        })

    })
})