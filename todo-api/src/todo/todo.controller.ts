import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('api/v1/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // POST /api/v1/todos
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  // GET /api/v1/todos
  // GET /api/v1/todos?completed=true
  // GET /api/v1/todos?completed=false
  @Get()
  findAll(@Query('completed') completed?: string) {
    let completedFilter: boolean | undefined;
    if (completed === 'true') completedFilter = true;
    if (completed === 'false') completedFilter = false;
    return this.todoService.findAll(completedFilter);
  }

  // GET /api/v1/todos/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.findOne(id);
  }

  // PUT /api/v1/todos/:id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(id, updateTodoDto);
  }

  // DELETE /api/v1/todos/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(id);
  }
}
