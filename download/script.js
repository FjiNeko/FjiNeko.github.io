// 文件系统的层次结构
const fileSystem = {
    'Files': [
        { name: '所有支持的文件', type: 'folder', content: [
            { name: '此页面内的文件均可下载！', type: 'text'},
            { name: 'txt1.txt', type: 'file', url: '/download/Example_Files/txt1.txt'},
            { name: 'data2.xlsx', type: 'file', url: '/download/Example_Files/data2.xlsx'},
            { name: 'task3.pptx', type: 'file', url: '/download/Example_Files/task3.pptx'},
            { name: 'note4.docx', type: 'file', url: '/download/Example_Files/note4.docx'},
            { name: 'img5.png', type: 'image', url: '/download/Example_Files/img5.png'},
            { name: 'proj6.zip', type: 'file', url: '/download/Example_Files/proj6.zip'},
            { name: 'vid7.mp4', type: 'video', url: '/download/Example_Files/vid7.mp4'},
            { name: 'aud8.flac', type: 'audio', url: '/download/Example_Files/aud8.flac'},
        ]},
        { name: '更新日志.txt', type: 'file', url: '/更新日志.txt' },
        { name: 'Minecraft', type: 'folder', content: [
            { name: '材质包', type: 'folder', content: [
                { name: '§cCozyUI§b+ §7v1.0 §0.zip', type: 'file', url: '/download/§cCozyUI§b+ §7v1.0 §0.zip' },
                { name: '彩虹像素☆冰云杉-附加包.zip', type: 'file', url: '/download/彩虹像素☆冰云杉-附加包.zip' },
                { name: '彩虹像素RainbowPixel~☆v3.2.3.zip', type: 'file', url: '/download/彩虹像素RainbowPixel~☆v3.2.3.zip' },
                // { name: '§cCozyUI§b+ §7v1.0 §0.zip', type: 'file', url: '/download/§cCozyUI§b+ §7v1.0 §0.zip' },
            ]}
        ]}
    ]
};

let hasAgreed = false;

// 定义公告版本号
const announcementVersion = '1.6.0';

// 加载公告状态
function loadAnnouncement() {
    const savedVersion = localStorage.getItem('announcementVersion');
    const hideAnnouncement = localStorage.getItem('hideAnnouncement');
    
    // 如果公告已经隐藏, 版本号未更新
    if (hideAnnouncement === 'true' && savedVersion === announcementVersion){
        return; // 不再显示公告
    }

    // 显示公告
    document.getElementById('announcement-overlay').style.display = 'block';
    document.getElementById('announcement-message').style.display = 'block';
}

// 隐藏公告
function hideAnnouncement() {
    document.getElementById('announcement-overlay').style.display = 'none';
    document.getElementById('announcement-message').style.display = 'none';

    // 设置不再显示公告，保存当前版本号
    localStorage.setItem('hideAnnouncement', 'true');
    localStorage.setItem('announcementVersion', announcementVersion);
}

// 监听
document.querySelector('.close-announcement-button').addEventListener('click', hideAnnouncement);

// 页面加载调用函数
window.onload = function() {
    loadAnnouncement();
};

// 视频缩略图获取
function getVideoThumbnail(videoUrl, callback) {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = "anonymous" //避免跨域

    // 加载元数据
    video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // 取视频第一帧
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 转换成图片URL
        const thumbnailUrl = canvas.toDataURL();
        callback(thumbnailUrl);
    });

    video.currentTime = 1; // 防止视频第一帧为黑屏。
}

// 同意协议
function agreeToTerms() {
    hasAgreed = true;
    localStorage.setItem('hasAgreed', true);
    closeAgreement();
}

// 关闭协议窗口
function closeAgreement() {
    document.getElementById('agreement-overlay').style.display = 'none';
}


// 保存当前路径
let currentPath = ['/root'];

// 加载文件夹内容
function enterFolder(folderName) {
    currentPath.push(folderName); // 进入新文件夹
    updateFileList();
}
// 播放媒体

// 播放媒体文件的函数
// 打开媒体窗口，包含播放功能和下载按钮
function openMediaModal(url, fileName, type) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.id = 'media-modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = 1000;

    // 创建播放窗口
    const modal = document.createElement('div');
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.borderRadius = '8px';
    modal.style.width = '75%';  // 控制窗口宽度适配移动端
    modal.style.maxWidth = '500px';  // 最大宽度为600px，防止太大
    modal.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.3)';
    modal.style.textAlign = 'center';

    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '20px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function () {
        document.body.removeChild(overlay);
    };

    // 媒体元素（视频或音频）
    let mediaElement;
    if (type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.src = url;
        mediaElement.controls = true;
        mediaElement.style.width = '100%';  // 窗口内的视频宽度为100%
    } else if (type === 'audio') {
        mediaElement = document.createElement('audio');
        mediaElement.src = url;
        mediaElement.controls = true;
        mediaElement.style.width = '100%';  // 音频播放器宽度设置为100%
    } else {
        mediaElement = document.createElement('img');
        mediaElement.src = url;
        mediaElement.style.width = '100%';
    }

    // 下载按钮
    const downloadButton = document.createElement('a');
    downloadButton.href = url;
    downloadButton.download = fileName;
    downloadButton.textContent = '下载';
    downloadButton.style.display = 'inline-block';
    downloadButton.style.marginTop = '15px';
    downloadButton.style.padding = '10px 20px';
    downloadButton.style.backgroundColor = '#007bff';
    downloadButton.style.color = '#fff';
    downloadButton.style.textDecoration = 'none';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.cursor = 'pointer';

    modal.appendChild(closeButton);
    modal.appendChild(mediaElement);
    modal.appendChild(downloadButton);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);
}



// 返回上一级
function goBack() {
    if (currentPath.length > 1) {
        currentPath.pop(); // 返回上一级
        updateFileList(); // 更新文件列表
    }
}

// 获取图标链接
function getIconUrl(file) {
    if (file.type === 'folder') {
        return 'https://s2.loli.net/2024/10/04/B1yhNESJ8ikQcto.webp'; // 文件夹图标
    }
    if (file.name.endsWith('.txt')) {
        return 'https://s2.loli.net/2024/10/04/khtA2QGVEyRFjDz.webp';
    }
    if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')){
        return 'https://s2.loli.net/2024/10/04/mMoZrltjRzIXVbE.webp';
    }
    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        return 'https://s2.loli.net/2024/10/04/Kg7Zj1hrBsckd8n.webp';
    }
    if (file.name.endsWith('.zip') || file.name.endsWith('.rar') || file.name.endsWith('.7z')) {
        return 'https://s2.loli.net/2024/10/04/L7sHeXIk9KSchvE.webp';
    }
    if (file.name.endsWith('pdf')) {
        return 'https://s2.loli.net/2024/10/04/gSi5RybGeH9sLCD.webp';
    }
    if (file.name.endsWith('xlsx') || (file.name.endsWith('xls'))) {
        return 'https://s2.loli.net/2024/10/04/JcgQ3ysMIpkbuPU.webp';
    }
    return 'https://s2.loli.net/2024/10/04/FqxgDGORnl4ryCt.webp'; // 普通文件图标
}

// 更新文件列表
function updateFileList() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    // 更新当前文件夹标题
    const currentFolder = document.getElementById('current-folder');
    currentFolder.textContent = currentPath.join(' / ');

    // 添加返回上一级按钮
    if (currentPath.length > 1) {
        const backButton = document.createElement('div');
        backButton.classList.add('back-button');
        backButton.innerHTML = `
            <img src="https://img.icons8.com/ios-glyphs/30/000000/back.png" alt="back icon">
            <span>返回上一级</span>
        `;
        backButton.onclick = goBack;
        fileList.appendChild(backButton);
    }

    let currentContent = fileSystem['Files'];
    for (let i = 1; i < currentPath.length; i++) {
        const folder = currentContent.find(item => item.name === currentPath[i]);
        if (folder && folder.type === 'folder') {
            currentContent = folder.content;
        }
    }

    // 动态生成文件和文件夹
    currentContent.forEach(file => {
        const fileDiv = document.createElement('div');
        fileDiv.classList.add('file');

        const iconUrl = getIconUrl(file);

        if (file.type === 'file') {
            fileDiv.innerHTML = `
                <input type="checkbox" class="file-checkbox" data-type="file" onclick="updateDownloadButton(this)">
                <img src="${iconUrl}" alt="file icon">
                <a href="${file.url}" download="${file.name}">${file.name}</a>
            `;
        } if (file.type === 'image') {
            fileDiv.innerHTML = `
                <input type="checkbox" class="file-checkbox" data-type="file" onclick="updateDownloadButton(this)">
                <img src="${file.url}" alt="${file.name}" class="thumbnail">
                <a download="${file.name}">${file.name}</a>
            `
        } if (file.type === 'text') {
            fileDiv.innerHTML = `
                <img src="https://s2.loli.net/2024/10/09/wxMb2SpjAszimla.webp" alt="hint icon">
                <span class="hint">${file.name}</span>
            `
        } 
        if (file.type === 'video') {
            // 调用函数
            getVideoThumbnail(file.url, (thumbnailUrl) => {
                fileDiv.innerHTML = `
                <input type="checkbox" class="file-checkbox" data-type="file" onclick="updateDownloadButton(this)">
                <img src="${thumbnailUrl}" alt="video icon">
                <a download="${file.name}">${file.name}</a>
            `;
            });
        } if (file.type === 'audio') {
            fileDiv.innerHTML = `
                <input type="checkbox" class="file-checkbox" data-type="file" onclick="updateDownloadButton(this)">
                <img src="https://s2.loli.net/2024/10/04/vfQ8OwgF9BoYLCe.webp" alt="audio icon">
                <a download="${file.name}">${file.name}</a>
            `
        } if (file.type === 'video' || file.type === 'audio' || file.type === 'image') {
            fileDiv.setAttribute("onclick", `openMediaModal('${file.url}', '${file.name}', '${file.type}')`);
        } else if (file.type === 'folder') {
            fileDiv.setAttribute("ondblclick", `enterFolder('${file.name}')`); // 双击进入文件夹
            fileDiv.innerHTML = `
                <input type="checkbox" class="file-checkbox" data-type="folder" onclick="handleCheckboxClick(this)">
                <img src="${iconUrl}" alt="folder icon">
                <span>${file.name}</span>
            `;
        }
        fileList.appendChild(fileDiv);
    });
}

// 检查文件夹选中状态，阻止下载文件夹
function handleCheckboxClick(checkbox) {
    const errorMessage = document.getElementById('error-message');
    const overlay = document.getElementById('error-overlay');
    
    if (checkbox.getAttribute('data-type') === 'folder' && checkbox.checked) {
        checkbox.checked = false; // 禁止选择文件夹
        overlay.style.display = 'block'; // 显示蒙版
        errorMessage.style.display = 'block'; // 显示错误提示
    } else {
        errorMessage.style.display = 'none'; // 隐藏错误提示
    }

    updateDownloadButton(); // 更新下载按钮状态
}

// 关闭按钮
document.querySelector('.close-button').addEventListener('click', closeError);
const dontshowAgain = document.getElementById('dont-show-again').checked;

// 判断条件
if (dontshowAgain){
    localStorage.setItem('d')
}


function closeError() {
    const errorMessage = document.getElementById('error-message');
    const overlay = document.getElementById('error-overlay');
    
    errorMessage.style.display = 'none'; // 隐藏错误提示
    overlay.style.display = 'none'; // 隐藏蒙版
}

        // 更新下载按钮的显示
        function updateDownloadButton() {
            const checkboxes = document.querySelectorAll('.file-checkbox');
            const downloadButton = document.getElementById('download-button');

            // 检查是否至少有一个复选框被选中
            const selectedFiles = Array.from(checkboxes).some(checkbox => checkbox.checked);

            // 显示或隐藏下载按钮
            if (selectedFiles) {
                downloadButton.style.display = 'block';
            } else {
                downloadButton.style.display = 'none';
            }
        }

        // 下载选中的文件
        function downloadSelected() {
            const checkboxes = document.querySelectorAll('.file-checkbox');
            checkboxes.forEach((checkbox, index) => {
                if (checkbox.checked) {
                    const link = checkbox.nextElementSibling.nextElementSibling; // 获取下载链接
                    if (link && link.tagName === 'A') {
                        link.click(); // 自动触发点击进行下载
                    }
                }
            });
        }

// 全选或取消全选
function selectAll() {
    const checkboxes = document.querySelectorAll('.file-checkbox');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    checkboxes.forEach(checkbox => {
        if (checkbox.getAttribute('data-type') === 'file') {
            checkbox.checked = !allChecked; // 只能选择文件
            updateDownloadButton(checkbox); // 更新对应下载按钮
        }
    });
}

// 初始化文件列表
updateFileList();
