import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Menyelesaikan Laporan Praktikum 11',
      description: 'Membuat dokumen PDF laporan CRUD full-stack dengan screenshot lengkap',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      createdAt: new Date('2026-07-23T08:00:00.000Z'),
      updatedAt: new Date('2026-07-23T08:00:00.000Z'),
    },
    {
      id: 2,
      title: 'Integrasi Frontend React & Backend NestJS',
      description: 'Menghubungkan Axios Interceptor dan modal CRUD ke REST API /api/v1/todos',
      completed: true,
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      createdAt: new Date('2026-07-23T07:30:00.000Z'),
      updatedAt: new Date('2026-07-23T07:45:00.000Z'),
    },
    {
      id: 3,
      title: 'Review UI Tema Nordic Minimalist Light & Emerald',
      description: 'Memastikan warna porcelain #F8FAFC dan aksen emerald #10B981 tampak konsisten',
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      createdAt: new Date('2026-07-23T07:00:00.000Z'),
      updatedAt: new Date('2026-07-23T07:00:00.000Z'),
    },
    {
      id: 4,
      title: 'Pengujian Unit & Filter Data Todo',
      description: 'Uji filter status Semua, Aktif, Selesai serta fitur pencarian realtime',
      completed: false,
      priority: 'low',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      createdAt: new Date('2026-07-23T06:30:00.000Z'),
      updatedAt: new Date('2026-07-23T06:30:00.000Z'),
    },
  ];

  private nextId = 5;

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const now = new Date();
    const newTodo: Todo = {
      id: this.nextId++,
      title: createTodoDto.title,
      description: createTodoDto.description || '',
      completed: createTodoDto.completed ?? false,
      priority: createTodoDto.priority || 'low',
      dueDate: createTodoDto.dueDate || new Date().toISOString().split('T')[0],
      createdAt: now,
      updatedAt: now,
    };
    this.todos.unshift(newTodo);
    return newTodo;
  }

  async findAll(completed?: boolean): Promise<Todo[]> {
    if (completed === undefined) {
      return [...this.todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return this.todos
      .filter((t) => t.completed === completed)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findOne(id: number): Promise<Todo> {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo dengan ID ${id} tidak ditemukan`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    const updatedTodo = {
      ...todo,
      ...updateTodoDto,
      updatedAt: new Date(),
    };
    const index = this.todos.findIndex((t) => t.id === id);
    this.todos[index] = updatedTodo;
    return updatedTodo;
  }

  async remove(id: number): Promise<{ message: string }> {
    const todoIndex = this.todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo dengan ID ${id} tidak ditemukan`);
    }
    this.todos.splice(todoIndex, 1);
    return { message: `Todo dengan ID ${id} berhasil dihapus` };
  }
}
