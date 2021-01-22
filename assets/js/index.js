$(function () {

    getUserInfo()
    var layer = layui.layer
    // 点击退出，弹出确认退出框，并且删除请求头
    $('#btnLogout').on('click', function (e) {
        e.preventDefault()
        // 
        layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function (index) {
            // 删除本地存储的token
            localStorage.removeItem('token');
            // 跳转到login.html页面
            location.href = "login.html"
            layer.close(index);
        });
    })

})
// 发起get请求，获取用户信息，请求头在baseAPI.js里面
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            } else {
                renderAvatar(res.data);
            }
        },
        // 防止用户直接登录后台页面，所以我们需要进行权限的校验，可以利用请求后服务器返回的状态来决定,

    })
};
function renderAvatar(user) {
    // 返回attr() 方法设置或返回被选元素的属性值。
    // $(selector).attr(attribute（规定属性的名称）,value（规定属性的值）)设置
    // 传进参数res.data，判断是否user_pic是否为空，为空，显示昵称的第一个字大写，没有昵称显示用户名的第一个字，如果有头像，显示头像
    // 头像文本内容优先级 （逻辑或）有真则真
    var name = user.nickname || user.username
    // 欢迎文本内容
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()

        $('.text-avatar').html(first).show()
    }
}