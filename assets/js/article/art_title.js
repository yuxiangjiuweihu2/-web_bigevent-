$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initEditor();
    initCate();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    };

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 将input隐藏起来，点击选择封面，模拟点击选择文件框


    $('#btnImage').on('click', function () {
        // 模拟点击input文件框自执行事件
        $('#fileInput').click();

    })
    // 监听fileInput的change事件，获取用户选择的文件列表
    $('#fileInput').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length == 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });
    // 发起请求，需要传五个参数
    var art_state = '已发布';
    // 点击存为草稿按钮，重新给art_state赋值
    $('#btnSave2').on('click', function () {
        console.log(11);
        art_state = '草稿'
    });
    // 获取前三个参数和state参数
    $('#form_pub').on('submit', function (e) {
        // 阻止表单的默认行为
        e.preventDefault()
        // 获取表单数据
        var fd = new FormData($(this)[0]);
        // 添加state参数
        fd.append('state', art_state)
        // 将封面裁剪过后的图片转换为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布（jq的画布）
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })

    });
    // 发起`Ajax`请求实现发布文章的功能
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                // location.href = "art_list.html"

            }
        })
    }


})