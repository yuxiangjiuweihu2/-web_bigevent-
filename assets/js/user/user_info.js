$(function () {
    var form = layui.form
    initUserInfo()
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    });
    // 用户点击 了重置按钮之后应该重新赋值
    $('#btnReset').on('click', function (e) {
        //   阻止默认
        e.preventDefault()
        //  重新获取用户信息
        initUserInfo();


    });

    //获取表单信息，发起请求
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // console.log(11);
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }

        })
    });

    // 获取用户信息,并且给表单赋值
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

});

