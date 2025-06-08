// app.js

// 从本地存储获取笔记或使用示例数据
let notes = JSON.parse(localStorage.getItem('myKnowledgeBaseNotes')) || [
  {
    id: 1,
    title: "Python基础知识",
    content: "Python是一种高级编程语言，具有简洁易读的语法...",
    category: "技术",
    tags: ["Python", "编程", "学习"],
    created: "2025-05-20",
    updated: "2025-06-01"
  },
  {
    id: 2,
    title: "React组件化开发",
    content: "React是一个用于构建用户界面的JavaScript库...",
    category: "技术",
    tags: ["React", "前端", "JavaScript"],
    created: "2025-05-25",
    updated: "2025-05-28"
  },
  {
    id: 3,
    title: "健康饮食指南",
    content: "保持健康的饮食习惯对身体健康至关重要...",
    category: "生活",
    tags: ["健康", "饮食", "生活方式"],
    created: "2025-05-28",
    updated: "2025-05-30"
  },
  {
    id: 4,
    title: "项目管理技巧",
    content: "有效的项目管理可以提高团队效率...",
    category: "工作",
    tags: ["项目管理", "工作", "团队协作"],
    created: "2025-06-01",
    updated: "2025-06-01"
  },
  {
    id: 5,
    title: "机器学习基础",
    content: "机器学习是人工智能的一个分支...",
    category: "学习",
    tags: ["机器学习", "AI", "学习"],
    created: "2025-06-03",
    updated: "2025-06-03"
  }
];

// 从本地存储获取分类数据
let categories = JSON.parse(localStorage.getItem('myKnowledgeBaseCategories')) || [
  { name: "技术", color: "blue" },
  { name: "生活", color: "green" },
  { name: "学习", color: "purple" },
  { name: "工作", color: "yellow" }
];

// 标签云数据
const tags = [
  { name: "Python", count: 12 },
  { name: "React", count: 8 },
  { name: "编程", count: 7 },
  { name: "学习", count: 6 },
  { name: "技术", count: 5 },
  { name: "JavaScript", count: 4 },
  { name: "前端", count: 4 },
  { name: "健康", count: 3 },
  { name: "生活", count: 3 },
  { name: "项目管理", count: 3 },
  { name: "工作", count: 3 },
  { name: "机器学习", count: 2 }
];

// 保存笔记到localStorage
function saveNotes() {
  localStorage.setItem('myKnowledgeBaseNotes', JSON.stringify(notes));
  updateDashboardStats();
}

// 更新仪表盘统计信息
function updateDashboardStats() {
  document.getElementById('total-notes').textContent = notes.length;
  document.getElementById('total-categories').textContent = categories.length;
  document.getElementById('total-tags').textContent = tags.length;
  
  if (notes.length > 0) {
    const sortedNotes = [...notes].sort((a, b) => new Date(b.updated) - new Date(a.updated));
    const lastUpdated = sortedNotes[0];
    document.getElementById('last-updated').textContent = formatDate(lastUpdated.updated);
    document.getElementById('last-note-title').textContent = lastUpdated.title;
  }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// 渲染笔记列表
function renderNotes(filteredNotes = notes) {
  const notesGrid = document.getElementById('notes-grid');
  const noNotes = document.getElementById('no-notes');
  
  notesGrid.innerHTML = '';
  
  if (filteredNotes.length === 0) {
    noNotes.classList.remove('hidden');
    return;
  }
  
  noNotes.classList.add('hidden');
  
  filteredNotes.forEach(note => {
    const noteCard = document.createElement('div');
    noteCard.className = 'bg-white rounded-xl shadow card-hover overflow-hidden';
    noteCard.innerHTML = `
      <div class="p-5">
        <div class="flex justify-between items-start mb-3">
          <span class="px-2 py-1 rounded text-xs font-medium ${getCategoryClass(note.category)}">
            ${note.category}
          </span>
          <span class="text-xs text-gray-500">${formatDate(note.updated)}</span>
        </div>
        <h3 class="text-lg font-semibold mb-2 line-clamp-1">${note.title}</h3>
        <div class="text-gray-600 text-sm mb-4 line-clamp-3">${truncateHTML(note.content)}</div>
        <div class="flex flex-wrap gap-1 mb-4">
          ${note.tags.map(tag => `<span class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">${tag}</span>`).join('')}
        </div>
        <div class="flex justify-end space-x-2">
          <button class="p-2 text-gray-500 hover:text-primary transition-colors" data-id="${note.id}" data-action="edit">
            <i class="fa fa-pencil"></i>
          </button>
          <button class="p-2 text-gray-500 hover:text-red-500 transition-colors" data-id="${note.id}" data-action="delete">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    notesGrid.appendChild(noteCard);
  });
  
  // 添加编辑和删除事件监听器
  document.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => openNote(parseInt(btn.dataset.id)));
  });
  
  document.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => confirmDeleteNote(parseInt(btn.dataset.id)));
  });
}

// 辅助函数：截断HTML内容
function truncateHTML(html, maxLength = 100) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || tempDiv.innerText || '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// 获取分类的CSS类
function getCategoryClass(categoryName) {
  const category = categories.find(cat => cat.name === categoryName);
  if (!category) return 'bg-gray-100 text-gray-700';
  
  const colorMap = {
    'blue': 'bg-blue-100 text-blue-800',
    'green': 'bg-green-100 text-green-800',
    'purple': 'bg-purple-100 text-purple-800',
    'yellow': 'bg-yellow-100 text-yellow-800',
    'red': 'bg-red-100 text-red-800',
    'gray': 'bg-gray-100 text-gray-700'
  };
  
  return colorMap[category.color] || 'bg-gray-100 text-gray-700';
}

// 渲染分类列表
function renderCategories() {
  const categoriesList = document.getElementById('categories-list');
  categoriesList.innerHTML = '';
  
  categories.forEach((category, index) => {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors';
    categoryItem.innerHTML = `
      <div class="flex items-center">
        <span class="w-3 h-3 rounded-full mr-2 ${getCategoryDotClass(category.color)}"></span>
        <span>${category.name}</span>
      </div>
      <div class="flex space-x-1">
        <span class="text-xs text-gray-500">${notes.filter(n => n.category === category.name).length} 笔记</span>
        <button class="p-1 text-gray-400 hover:text-red-500 transition-colors" data-index="${index}" data-action="delete-category">
          <i class="fa fa-times"></i>
        </button>
      </div>
    `;
    categoriesList.appendChild(categoryItem);
  });
  
  // 添加删除分类事件监听器
  document.querySelectorAll('[data-action="delete-category"]').forEach(btn => {
    btn.addEventListener('click', () => confirmDeleteCategory(parseInt(btn.dataset.index)));
  });
}

// 获取分类点的CSS类
function getCategoryDotClass(color) {
  const colorMap = {
    'blue': 'bg-blue-500',
    'green': 'bg-green-500',
    'purple': 'bg-purple-500',
    'yellow': 'bg-yellow-500',
    'red': 'bg-red-500',
    'gray': 'bg-gray-500'
  };
  
  return colorMap[color] || 'bg-gray-500';
}

// 渲染标签云
function renderTags() {
  const tagsCloud = document.getElementById('tags-cloud');
  tagsCloud.innerHTML = '';
  
  // 取前10个标签
  const topTags = tags.slice(0, 10);
  
  topTags.forEach(tag => {
    const tagElement = document.createElement('a');
    const sizeClass = getTagSizeClass(tag.count);
    tagElement.className = `px-3 py-1 rounded-full ${sizeClass} hover:opacity-80 transition-opacity inline-block`;
    tagElement.href = '#';
    tagElement.textContent = tag.name;
    tagsCloud.appendChild(tagElement);
  });
}

// 根据标签频率获取大小类
function getTagSizeClass(count) {
  if (count >= 10) return 'bg-blue-500 text-white';
  if (count >= 7) return 'bg-blue-400 text-white';
  if (count >= 4) return 'bg-blue-300 text-blue-800';
  return 'bg-blue-100 text-blue-700';
}

// 初始化图表
function initCharts() {
  // 笔记增长趋势图表
  const trendCtx = document.getElementById('notes-trend-chart').getContext('2d');
  const trendChart = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [{
        label: '笔记数量',
        data: [3, 5, 8, 12, 15, 20],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
  
  // 分类分布图表
  const categoryCtx = document.getElementById('categories-chart').getContext('2d');
  const categoryChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
      labels: categories.map(cat => cat.name),
      datasets: [{
        data: [notes.filter(n => n.category === '技术').length, 
              notes.filter(n => n.category === '生活').length,
              notes.filter(n => n.category === '学习').length,
              notes.filter(n => n.category === '工作').length],
        backgroundColor: [
          '#3B82F6', // blue
          '#10B981', // green
          '#8B5CF6', // purple
          '#F59E0B'  // yellow
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            boxWidth: 12
          }
        }
      },
      cutout: '70%'
    }
  });
}

// 打开笔记进行编辑
function openNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  
  document.getElementById('modal-title').textContent = '编辑笔记';
  document.getElementById('note-title').value = note.title;
  document.getElementById('note-content').innerHTML = note.content;
  document.getElementById('note-category').value = note.category;
  document.getElementById('note-tags').value = note.tags.join(', ');
  document.getElementById('delete-note').classList.remove('hidden');
  document.getElementById('delete-note').dataset.id = id;
  
  document.getElementById('note-modal').classList.remove('hidden');
  document.getElementById('note-title').focus();
}

// 新建笔记
function newNote() {
  document.getElementById('modal-title').textContent = '新建笔记';
  document.getElementById('note-title').value = '';
  document.getElementById('note-content').innerHTML = '';
  document.getElementById('note-category').value = categories.length > 0 ? categories[0].name : '';
  document.getElementById('note-tags').value = '';
  document.getElementById('delete-note').classList.add('hidden');
  
  document.getElementById('note-modal').classList.remove('hidden');
  document.getElementById('note-title').focus();
}

// 保存笔记
function saveCurrentNote() {
  const title = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').innerHTML;
  const category = document.getElementById('note-category').value;
  const tagsInput = document.getElementById('note-tags').value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
  
  if (!title) {
    alert('请输入笔记标题');
    return;
  }
  
  const deleteBtn = document.getElementById('delete-note');
  const isEdit = !deleteBtn.classList.contains('hidden');
  
  if (isEdit) {
    // 编辑现有笔记
    const id = parseInt(deleteBtn.dataset.id);
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex !== -1) {
      notes[noteIndex] = {
        ...notes[noteIndex],
        title,
        content,
        category,
        tags,
        updated: new Date().toISOString().split('T')[0]
      };
    }
  } else {
    // 创建新笔记
    const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
    notes.push({
      id: newId,
      title,
      content,
      category,
      tags,
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0]
    });
  }
  
  saveNotes();
  renderNotes();
  document.getElementById('note-modal').classList.add('hidden');
}

// 确认删除笔记
function confirmDeleteNote(id) {
  if (confirm('确定要删除此笔记吗？此操作不可撤销。')) {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
    renderNotes();
  }
}

// 打开新建分类模态框
function openCategoryModal() {
  document.getElementById('category-name').value = '';
  document.querySelectorAll('.category-color-btn').forEach(btn => {
    btn.classList.remove('border-primary');
    if (btn.dataset.color === 'blue') {
      btn.classList.add('border-primary');
    }
  });
  document.getElementById('category-modal').classList.remove('hidden');
}

// 保存新分类
function saveNewCategory() {
  const name = document.getElementById('category-name').value.trim();
  if (!name) {
    alert('请输入分类名称');
    return;
  }
  
  if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
    alert('该分类已存在');
    return;
  }
  
  let selectedColor = 'blue';
  document.querySelectorAll('.category-color-btn').forEach(btn => {
    if (btn.classList.contains('border-primary')) {
      selectedColor = btn.dataset.color;
    }
  });
  
  categories.push({ name, color: selectedColor });
  // 保存分类数据到本地存储
  localStorage.setItem('myKnowledgeBaseCategories', JSON.stringify(categories));
  renderCategories();
  
  // 更新笔记分类下拉框选项
  const noteCategorySelect = document.getElementById('note-category');
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  noteCategorySelect.appendChild(option);
  
  // 更新筛选器中的分类选项
  const filterCategorySelect = document.getElementById('category-filter');
  const filterOption = document.createElement('option');
  filterOption.value = name;
  filterOption.textContent = name;
  filterCategorySelect.appendChild(filterOption);
  
  document.getElementById('category-modal').classList.add('hidden');
}

// 确认删除分类
function confirmDeleteCategory(index) {
  if (confirm('确定要删除此分类吗？此操作不会删除相关笔记。')) {
    categories.splice(index, 1);
    localStorage.setItem('myKnowledgeBaseCategories', JSON.stringify(categories));
    renderCategories();
    
    // 更新笔记分类下拉框
    const noteCategorySelect = document.getElementById('note-category');
    noteCategorySelect.innerHTML = '';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.name;
      option.textContent = category.name;
      noteCategorySelect.appendChild(option);
    });
    
    // 更新筛选器中的分类选项
    const filterCategorySelect = document.getElementById('category-filter');
    filterCategorySelect.innerHTML = '<option value="">所有分类</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.name;
      option.textContent = category.name;
      filterCategorySelect.appendChild(option);
    });
  }
}

// 应用筛选
function applyFilters() {
  const categoryFilter = document.getElementById('category-filter').value;
  const sortFilter = document.getElementById('sort-filter').value;
  
  let filteredNotes = [...notes];
  
  // 按分类筛选
  if (categoryFilter) {
    filteredNotes = filteredNotes.filter(note => note.category === categoryFilter);
  }
  
  // 排序
  switch (sortFilter) {
    case 'recent':
      filteredNotes.sort((a, b) => new Date(b.updated) - new Date(a.updated));
      break;
    case 'oldest':
      filteredNotes.sort((a, b) => new Date(a.updated) - new Date(b.updated));
      break;
    case 'az':
      filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'za':
      filteredNotes.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }
  
  renderNotes(filteredNotes);
}

// 搜索笔记
function searchNotes() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  
  if (!searchTerm) {
    renderNotes();
    return;
  }
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm) || 
    note.content.toLowerCase().includes(searchTerm) || 
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
  
  renderNotes(filteredNotes);
}

// 切换深色/浅色模式
function toggleTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const icon = themeToggle.querySelector('i');
  
  if (icon.classList.contains('fa-moon-o')) {
    icon.classList.remove('fa-moon-o');
    icon.classList.add('fa-sun-o');
    document.body.classList.add('dark');
    // 实际应用中可以添加深色模式的CSS
  } else {
    icon.classList.remove('fa-sun-o');
    icon.classList.add('fa-moon-o');
    document.body.classList.remove('dark');
  }
}

// 切换搜索框显示
function toggleSearch() {
  const searchContainer = document.getElementById('search-container');
  searchContainer.classList.toggle('hidden');
  
  if (!searchContainer.classList.contains('hidden')) {
    document.getElementById('search-input').focus();
  }
}

// 切换移动端菜单
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('hidden');
}

// 插入图片
function insertImage() {
  const imageUrl = prompt('请输入图片的URL');
  if (imageUrl) {
    const noteContent = document.getElementById('note-content');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.cursor = 'se-resize';
    img.classList.add('resizable-image');
    
    // 保存当前选区
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(img);
      
      // 恢复选区
      const newRange = document.createRange();
      newRange.setStartAfter(img);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      noteContent.appendChild(img);
    }
    
    noteContent.focus();
  }
}

// 初始化事件监听器
function initEventListeners() {
  // 新建笔记按钮
  document.getElementById('add-note-btn').addEventListener('click', newNote);
  document.getElementById('create-first-note').addEventListener('click', newNote);
  
  // 保存笔记按钮
  document.getElementById('save-note').addEventListener('click', saveCurrentNote);
  
  // 取消笔记按钮
  document.getElementById('cancel-note').addEventListener('click', () => {
    document.getElementById('note-modal').classList.add('hidden');
  });
  
  // 关闭模态框按钮
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('note-modal').classList.add('hidden');
  });
  
    // 删除笔记按钮
    document.getElementById('delete-note').addEventListener('click', () => {
    const id = parseInt(document.getElementById('delete-note').dataset.id);
    confirmDeleteNote(id);
    document.getElementById('note-modal').classList.add('hidden');
  });
  
  // 新建分类按钮
  document.getElementById('add-category-btn').addEventListener('click', openCategoryModal);
  
  // 保存分类按钮
  document.getElementById('save-category').addEventListener('click', saveNewCategory);
  
  // 取消分类按钮
  document.getElementById('cancel-category').addEventListener('click', () => {
    document.getElementById('category-modal').classList.add('hidden');
  });
  
  // 关闭分类模态框按钮
  document.getElementById('close-category-modal').addEventListener('click', () => {
    document.getElementById('category-modal').classList.add('hidden');
  });
  
  // 分类颜色选择
  document.querySelectorAll('.category-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-color-btn').forEach(b => {
        b.classList.remove('border-primary');
      });
      btn.classList.add('border-primary');
    });
  });
  
  // 筛选和排序
  document.getElementById('category-filter').addEventListener('change', applyFilters);
  document.getElementById('sort-filter').addEventListener('change', applyFilters);
  
  // 搜索
  document.getElementById('search-btn').addEventListener('click', toggleSearch);
  document.getElementById('search-input').addEventListener('input', searchNotes);
  
  // 主题切换
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // 移动端菜单
  document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);
  
  // 插入图片
  document.getElementById('insert-image-btn').addEventListener('click', insertImage);
  
  // 滚动效果
  window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 10) {
      header.classList.add('shadow-md');
      header.classList.remove('shadow-sm');
    } else {
      header.classList.remove('shadow-md');
      header.classList.add('shadow-sm');
    }
  });
  
  // 标签云点击事件
  document.querySelectorAll('#tags-cloud a').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      const tagName = tag.textContent;
      document.getElementById('search-input').value = tagName;
      searchNotes();
      if (document.getElementById('search-container').classList.contains('hidden')) {
        toggleSearch();
      }
    });
  });
}

// 初始化分类下拉框
function initCategorySelects() {
  const noteCategorySelect = document.getElementById('note-category');
  const filterCategorySelect = document.getElementById('category-filter');
  
  noteCategorySelect.innerHTML = '';
  filterCategorySelect.innerHTML = '<option value="">所有分类</option>';
  
  categories.forEach(category => {
    const noteOption = document.createElement('option');
    noteOption.value = category.name;
    noteOption.textContent = category.name;
    noteCategorySelect.appendChild(noteOption);
    
    const filterOption = document.createElement('option');
    filterOption.value = category.name;
    filterOption.textContent = category.name;
    filterCategorySelect.appendChild(filterOption);
  });
}

// 初始化应用
function initApp() {
  updateDashboardStats();
  renderNotes();
  renderCategories();
  renderTags();
  initCategorySelects();
  initCharts();
  initEventListeners();
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);