$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initCate();
    initTable();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    };

    // 美化时间
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义时间的补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文分类失败！')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr)
                // 对于动态生成的元素，需要重新渲染该区域的内容
                //通知layui重新渲染局部表单结构
                form.render()
            }

        })
    };


    //筛选功能
    // 把满足条件的内容筛选出来
    //- 1.需要先绑定表单的 `submit` 事件
    // - 2.在事件里面获取到表单中选中的值
    // - 3.然后把这个值同步到我们 参数对象 `q` 里面
    // - 4.再次调用 `initTable()` 方法即可
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        console.log(11);
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id;
        q.state = state
        initTable()
    })

    // 分页功能
    //数据获取到之后才定义渲染分页的功能
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号, 
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,//每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6],
            //    分页发生切换的时候。触发jump回调
            jump: function (obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr;
                // 切换条目时获取数据
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }
            }
        });
    };
    // 代理
    $('tbody').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        var len = $('.btn-delete').length
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    };
                    layer.msg('删除文章成功');
                    //当数据删除后，判断当前这一页，是否还有剩余的数据
                    // 如果没有剩余数据，则让页码减一
                    // 再重新调用initTable方法
                    // 先获取当前页面总共有几条数据
                    // 判断按钮删除个数等于1
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    };
                }
            });
            initTable();
            layer.close(index);
        });
    })
})