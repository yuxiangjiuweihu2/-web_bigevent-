// 原密码是否正确
// 新密码和原密码是否一致
// 确认新密码和新密码是否一致
$(function () {
    // 导入form
    var form = layui.form
    // console.log(11);
    // 自定义密码规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //  新增校验规则
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        // 新增确认新密码校验规则
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })
    // 表单绑定submit事件，
    $('.layui-form').on('submit', function (e) {
        // 阻止提交行为
        e.preventDefault()
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 一次性获取表单内容，前提是必须有name属性它的值必须和请求携带的参数一致
            // 快速获取表单
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单内容置空  获取到的是jq对象，通过[0].转换为原生dom元素，调用form的reset方法，他只能用于原生对象
                $('.layui-form')[0].reset()
            }
        })
    });

})
