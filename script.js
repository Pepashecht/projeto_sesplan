// Array de tarefas
let tasks = [];

// Carregar tarefas do localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('sesplanTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        // Dados de exemplo (você pode remover depois)
        tasks = [
            {
                id: 1,
                description: "Solicitar manutenção do ar-condicionado na UBSF",
                created: "16/04/2026 19:15",
                completed: false,
                completedAt: null
            },
            {
                id: 2,
                description: "Atualizar estoque de medicamentos da farmácia municipal",
                created: "16/04/2026 18:45",
                completed: true,
                completedAt: "16/04/2026 20:05"
            }
        ];
        saveTasks();
    }
}

// Salvar no localStorage
function saveTasks() {
    localStorage.setItem('sesplanTasks', JSON.stringify(tasks));
}

// Data/hora atual
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleDateString('pt-BR') + ' ' + 
           now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Renderizar tarefas
function renderTasks() {
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');
    
    pendingList.innerHTML = '';
    completedList.innerHTML = '';
    
    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);
    
    // Pendentes
    if (pending.length === 0) {
        pendingList.innerHTML = `<li class="empty-state"><p>Nenhuma tarefa pendente.<br>Adicione uma nova demanda acima!</p></li>`;
    } else {
        pending.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span class="id-badge">${task.id}</span>
                <input type="checkbox" data-id="${task.id}">
                <div class="task-content">
                    <div class="task-description">${task.description}</div>
                    <div class="task-meta"><span><strong>Criado em:</strong> ${task.created}</span></div>
                </div>
            `;
            pendingList.appendChild(li);
        });
    }
    
    // Concluídas
    if (completed.length === 0) {
        completedList.innerHTML = `<li class="empty-state"><p>Nenhuma tarefa concluída ainda.<br>Marque as pendentes como finalizadas!</p></li>`;
    } else {
        completed.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item completed';
            li.innerHTML = `
                <span class="id-badge" style="background:#00a676">${task.id}</span>
                <input type="checkbox" checked data-id="${task.id}">
                <div class="task-content">
                    <div class="task-description">${task.description}</div>
                    <div class="task-meta">
                        <span><strong>Criado em:</strong> ${task.created}</span>
                        <span><strong>Concluído em:</strong> ${task.completedAt}</span>
                    </div>
                </div>
            `;
            completedList.appendChild(li);
        });
    }
    
    // Eventos dos checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = parseInt(this.getAttribute('data-id'));
            toggleTaskStatus(taskId);
        });
    });
}

// Alternar status
function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    task.completed = !task.completed;
    task.completedAt = task.completed ? getCurrentDateTime() : null;
    
    saveTasks();
    renderTasks();
}

// Adicionar tarefa
function addTask(description) {
    if (!description.trim()) return;
    
    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        description: description.trim(),
        created: getCurrentDateTime(),
        completed: false,
        completedAt: null
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    
    document.getElementById('taskInput').value = '';
}

// Inicializar
function init() {
    loadTasks();
    renderTasks();
    
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTask(document.getElementById('taskInput').value);
    });
    
    console.log('%c✅ SESPLAN carregado com sucesso! (HTML + CSS + JS separados)', 'color:#00a676; font-weight:bold');
}

window.onload = init;