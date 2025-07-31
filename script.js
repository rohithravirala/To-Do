               tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#ff6b6b',
                        secondary: '#4ecdc4',
                        dark: '#1a1a2e',
                        darker: '#0f3460',
                    },
                    fontFamily: {
                        inter: ['Inter', 'sans-serif'],
                    },
                }
            }
        }
        
       const tasks = [];
        let activeFilter = 'all';

        document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.querySelector('input[type="text"]');
            const dateInput = document.querySelector('input[type="date"]');
            const categorySelect = document.querySelector('select');
            const addButton = document.querySelector('.btn-gradient');
            const tasksContainer = document.querySelector('.space-y-4');
            const emptyState = document.getElementById('empty-state');

            // Initialize with sample tasks
            initSampleTasks();

            // Add task functionality
            addButton.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') addTask();
            });

            // Category tabs filter
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.category-tab').forEach(t => 
                        t.classList.remove('active'));
                    this.classList.add('active');
                    activeFilter = this.textContent.toLowerCase();
                    renderTasks();
                });
            });

            function initSampleTasks() {
                tasks.push({
                    id: Date.now(),
                    title: 'Complete UI design for Quantum',
                    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    category: 'work',
                    completed: false
                });
                tasks.push({
                    id: Date.now() + 1,
                    title: 'Buy groceries for the week',
                    date: new Date().toISOString().split('T')[0],
                    category: 'shopping',
                    completed: false
                });
                tasks.push({
                    id: Date.now() + 2,
                    title: 'Setup GitHub repository',
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    category: 'work',
                    completed: true
                });
                renderTasks();
            }

            function addTask() {
                const title = taskInput.value.trim();
                if (!title) return;

                tasks.push({
                    id: Date.now(),
                    title,
                    date: dateInput.value || new Date().toISOString().split('T')[0],
                    category: categorySelect.value || 'other',
                    completed: false
                });

                taskInput.value = '';
                dateInput.value = '';
                categorySelect.value = '';
                renderTasks();
            }

            function renderTasks() {
                const filteredTasks = tasks.filter(task => {
                    if (activeFilter === 'all') return true;
                    if (activeFilter === 'completed') return task.completed;
                    return task.category === activeFilter;
                });

                tasksContainer.innerHTML = '';
                if (filteredTasks.length === 0) {
                    emptyState.style.display = 'block';
                    tasksContainer.appendChild(emptyState);
                    return;
                }

                emptyState.style.display = 'none';
                filteredTasks.forEach(task => {
                    const taskEl = document.createElement('div');
                    taskEl.className = `card rounded-xl p-4 task-item ${task.completed ? 'completed' : ''}`;
                    taskEl.innerHTML = `
                        <div class="flex items-center">
                            <div class="checkbox-glow mr-4">
                                <input type="checkbox" class="rounded" ${task.completed ? 'checked' : ''}>
                            </div>
                            <div class="flex-grow">
                                <h3 class="task-title font-medium text-slate-100">${task.title}</h3>
                                <div class="flex items-center mt-1 text-sm text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>${formatDate(task.date)}</span>
                                    <span class="mx-2">•</span>
                                    <span class="bg-slate-800 ${getCategoryClass(task.category)} px-2 py-0.5 rounded text-xs">${capitalizeFirstLetter(task.category)}</span>
                                </div>
                            </div>
                            <div class="flex space-x-2 ml-4">
                                <button class="edit-btn w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 text-slate-300 hover:text-primary hover:bg-slate-700 transition-colors" data-id="${task.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button class="delete-btn w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 text-slate-300 hover:text-red-500 hover:bg-slate-700 transition-colors" data-id="${task.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `;
                    tasksContainer.appendChild(taskEl);
                });

                // Add event listeners to new elements
                document.querySelectorAll('.checkbox-glow input[type="checkbox"]').forEach(checkbox => {
                    checkbox.addEventListener('change', function() {
                        const taskId = parseInt(this.closest('.task-item').querySelector('.delete-btn').dataset.id);
                        const taskIndex = tasks.findIndex(t => t.id === taskId);
                        tasks[taskIndex].completed = this.checked;
                        renderTasks();
                    });
                });

                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const taskId = parseInt(this.dataset.id);
                        const taskIndex = tasks.findIndex(t => t.id === taskId);
                        tasks.splice(taskIndex, 1);
                        renderTasks();
                    });
                });

                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const taskId = parseInt(this.dataset.id);
                        const task = tasks.find(t => t.id === taskId);
                        taskInput.value = task.title;
                        dateInput.value = task.date;
                        categorySelect.value = task.category;
                        
                        const taskIndex = tasks.findIndex(t => t.id === taskId);
                        tasks.splice(taskIndex, 1);
                    });
                });
            }

            function formatDate(dateStr) {
                const date = new Date(dateStr);
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                if (date.toDateString() === today.toDateString()) return 'Today';
                if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
                
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
                
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }

            function getCategoryClass(category) {
                switch(category) {
                    case 'work': return 'text-primary';
                    case 'shopping': return 'text-secondary';
                    default: return 'text-slate-500';
                }
            }

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        });