  // 文件系统的层次结构
  const fileSystem = {
    'Files': [
        { name: '所有支持的文件', type: 'folder', content: [
            { name: '此页面内的文件均无法下载！请勿点击下载！', type: 'file', url: '此页面内的文件均无法下载！请勿点击下载.'},
            { name: '文本文档.txt', type: 'file', url: '1.txt'},
            { name: '演示文稿.txt', type: 'file', url: '1.ppt'},
            { name: 'word文档.docx', type: 'file', url: '1.docx'},
            { name: '图片文件.jpg', type: 'file', url: '1.jpg'},
            { name: '压缩文件.zip', type: 'file', url: '1.zip'},
        ]},
        { name: '更新日志.txt', type: 'file', url: './更新日志.txt' },
        { name: 'Minecraft', type: 'folder', content: [
            { name: '材质包', type: 'folder', content: [
                { name: 'Soartex_Fanver - Rebirth1.5.3.zip', type: 'file', url: 'Soartex_Fanver - Rebirth1.5.3.zip' },
            ]}
        ]}
    ]
};

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
    if (file.name.endsWith('.ppt')) {
        return 'https://s2.loli.net/2024/10/04/mMoZrltjRzIXVbE.webp';
    }
    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        return 'https://s2.loli.net/2024/10/04/Kg7Zj1hrBsckd8n.webp';
    }
    if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
        return 'https://s2.loli.net/2024/10/04/hBNZE36CWQDmJXU.webp';
    }
    if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
        return 'https://s2.loli.net/2024/10/04/L7sHeXIk9KSchvE.webp';
    }
    if (file.name.endsWith('pdf')) {
        return 'https://s2.loli.net/2024/10/04/gSi5RybGeH9sLCD.webp'
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
                <input type="checkbox" class="file-checkbox" data-type="file" onclick="updateDownloadButton()">
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
        }
        fileList.appendChild(fileDiv);
    });
}

// 检查文件夹选中状态，阻止下载文件夹
function handleCheckboxClick(checkbox) {
    const errorMessage = document.getElementById('error-message');
    
    if (checkbox.getAttribute('data-type') === 'folder' && checkbox.checked) {
        checkbox.checked = false; // 禁止选择文件夹
        errorMessage.style.display = 'block'; // 显示错误提示
    } else {
        errorMessage.style.display = 'none'; // 隐藏错误提示
    }

    updateDownloadButton(); // 更新下载按钮状态
}

 // 更新下载按钮的显示
 function updateDownloadButton(checkbox) {
    const downloadButton = checkbox.closest('.file').querySelector('.download-button');
    downloadButton.style.display = checkbox.checked ? 'block' : 'none'; // 根据复选框状态显示或隐藏下载按钮
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