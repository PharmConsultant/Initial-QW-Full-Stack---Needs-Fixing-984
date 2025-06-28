import { v4 as uuidv4 } from 'uuid';

class TaskAPI {
  constructor() {
    this.storageKey = 'taskflow_data';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        tasks: [],
        users: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c2ed?w=100&h=100&fit=crop&crop=face'
          }
        ],
        currentUser: '1'
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Tasks API
  async getTasks() {
    await this.delay();
    const data = this.getData();
    return { success: true, data: data.tasks };
  }

  async createTask(taskData) {
    await this.delay();
    const data = this.getData();
    const newTask = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: data.currentUser
    };
    data.tasks.push(newTask);
    this.saveData(data);
    return { success: true, data: newTask };
  }

  async updateTask(id, updates) {
    await this.delay();
    const data = this.getData();
    const taskIndex = data.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return { success: false, error: 'Task not found' };
    }

    data.tasks[taskIndex] = {
      ...data.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveData(data);
    return { success: true, data: data.tasks[taskIndex] };
  }

  async deleteTask(id) {
    await this.delay();
    const data = this.getData();
    data.tasks = data.tasks.filter(task => task.id !== id);
    this.saveData(data);
    return { success: true };
  }

  // Users API
  async getUsers() {
    await this.delay();
    const data = this.getData();
    return { success: true, data: data.users };
  }

  async getCurrentUser() {
    await this.delay();
    const data = this.getData();
    const user = data.users.find(u => u.id === data.currentUser);
    return { success: true, data: user };
  }

  // Analytics API
  async getAnalytics() {
    await this.delay();
    const data = this.getData();
    const tasks = data.tasks;

    const analytics = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      todoTasks: tasks.filter(t => t.status === 'todo').length,
      highPriorityTasks: tasks.filter(t => t.priority === 'high').length,
      tasksByPriority: {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      },
      recentTasks: tasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    };

    return { success: true, data: analytics };
  }
}

export default new TaskAPI();