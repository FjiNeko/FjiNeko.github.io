// 文件系统的层次结构
const fileSystem = {
    'Files': [
        { name: '所有支持的文件', type: 'folder', content: [
            { name: '此页面内的文件均无法下载！请勿点击下载！', type: 'file', url: '1.lnk'},
            { name: '文本文档.txt', type: 'file', url: './Example_files/1.txt'},
            { name: '演示文稿.ppt', type: 'file', url: './Example_files/1.pptx'},
            { name: 'word文档.docx', type: 'file', url: './Example_files/1.docx'},
            { name: '图片文件.png', type: 'image', url: './Example_files/图片文件.png'},
            { name: '压缩文件.zip', type: 'file', url: './Example_files/1.zip'},
        ]},
        { name: '更新日志.txt', type: 'file', url: './更新日志.txt' },
        { name: 'Minecraft', type: 'folder', content: [
            { name: '材质包', type: 'folder', content: [
                { name: 'Soartex_Fanver - Rebirth1.5.3.zip', type: 'file', url: 'Soartex_Fanver - Rebirth1.5.3.zip' },
            ]}
        ]}
    ]
};

let hasAgreed = false;

// 页面加载时显示公告
window.onload = function() {
    document.getElementById('announcement-overlay').style.display = 'block';
    if (!localStorage.getItem('hasAgreed')) {
        document.getElementById('agreement-overlay').style.display = 'block';
    }
};

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

// 关闭公告窗口
function closeAnnouncement() {
    document.getElementById('announcement-overlay').style.display = 'none';
}

// 保存当前路径
let currentPath = ['/root'];

// 加载文件夹内容
function enterFolder(folderName) {
    currentPath.push(folderName); // 进入新文件夹
    updateFileList();
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
    if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
        return 'https://s2.loli.net/2024/10/04/L7sHeXIk9KSchvE.webp';
    }
    if (file.name.endsWith('pdf')) {
        return 'https://s2.loli.net/2024/10/04/gSi5RybGeH9sLCD.webp';
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
        } else if (file.type === 'folder') {
            fileDiv.setAttribute("ondblclick", `enterFolder('${file.name}')`); // 双击进入文件夹
            fileDiv.innerHTML = `
                <input type="checkbox" class="file-checkbox" data-type="folder" onclick="handleCheckboxClick(this)">
                <img src="${iconUrl}" alt="folder icon">
                <span>${file.name}</span>
            `;
        } if (file.type === 'image') {
            fileDiv.innerHTML = `
            <input type="checkbox" class="file-checkbox" data-type="file" onclick="updateDownloadButton(this)">
            <img src="${file.url}" alt="${file.name}" class="thumbnail">
            <a href="${file.url}" download="${file.name}">${file.name}</a>
            `
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

// 关闭错误提示框
document.querySelector('.close-button').addEventListener('click', closeError);

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
