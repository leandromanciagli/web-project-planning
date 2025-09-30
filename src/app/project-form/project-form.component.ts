import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateProjectRequest } from '../models/project-task.model';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  collapsedTasks: boolean[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      tasks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Agregar una etapa inicial
    this.addTask();
  }

  get tasks(): FormArray {
    return this.projectForm.get('tasks') as FormArray;
  }

  createTaskFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['medium', Validators.required],
      dueDate: ['', Validators.required],
      estimatedHours: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addTask(): void {
    const taskFormGroup = this.createTaskFormGroup();
    this.tasks.push(taskFormGroup);
    
    // Colapsar todas las tasks existentes
    this.collapsedTasks = this.collapsedTasks.map(() => true);
    // Nueva etapa inicia expandida
    this.collapsedTasks.push(false);
    
    // Scroll automático a la nueva etapa después de un pequeño delay
    setTimeout(() => {
      this.scrollToNewTask();
    }, 100);
  }

  removeTask(index: number): void {
    if (this.tasks.length > 1) {
      this.tasks.removeAt(index);
      this.collapsedTasks.splice(index, 1); // Remover también el estado de colapso
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Create API request object
      const apiProjectData: CreateProjectRequest = {
        name: this.projectForm.value.name,
        description: this.projectForm.value.description,
        startDate: this.projectForm.value.startDate,
        endDate: this.projectForm.value.endDate,
        ownerId: 2,
        tasks: this.projectForm.value.tasks.map((task: any) => ({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          estimatedHours: task.estimatedHours,
          status: 'todo'
        }))
      };

      console.log('Enviando datos al API:', apiProjectData);

      // Call the API
      this.projectService.createProject(apiProjectData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            // console.log('Proyecto creado exitosamente:', response.data);
            alert(response.message);
            this.resetForm();
          } else {
            // console.error('Error en la respuesta:', response.error);
            alert(`Error: ${response.message || response.error}`);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error al llamar al API:', error);
          alert(`Error de conexión: ${error.message || 'No se pudo conectar con el servidor'}\n\nVerifica que el backend esté funcionando en http://localhost:5001`);
        }
      });
    } else {
      this.markFormGroupTouched();
      alert('Por favor, complete todos los campos requeridos correctamente.');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });

    this.tasks.controls.forEach(control => {
      Object.keys(control.value).forEach(key => {
        control.get(key)?.markAsTouched();
      });
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  resetForm(): void {
    this.projectForm.reset();
    this.projectForm.patchValue({
      ownerId: 1 // Reset to default ownerId
    });
    this.tasks.clear();
    this.collapsedTasks = [];
    this.addTask();
  }

  toggleTaskCollapse(index: number): void {
    const isCurrentlyCollapsed = this.collapsedTasks[index];
    
    // Si la etapa está colapsada y se va a expandir, colapsar todas las demás
    if (isCurrentlyCollapsed) {
      // Colapsar todas las tasks
      this.collapsedTasks = this.collapsedTasks.map(() => true);
      // Expandir solo la etapa actual
      this.collapsedTasks[index] = false;
    } else {
      // Si la etapa está expandida, colapsarla (mantener el comportamiento actual)
      this.collapsedTasks[index] = true;
    }
  }

  isTaskCollapsed(index: number): boolean {
    return this.collapsedTasks[index] || false;
  }

  private scrollToNewTask(): void {
    const tasksContainer = document.querySelector('.tasks-container');
    if (tasksContainer) {
      const lastTaskCard = tasksContainer.querySelector('.task-card:last-child');
      if (lastTaskCard) {
        lastTaskCard.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }

  isFieldInvalid(fieldName: string, taskIndex?: number): boolean {
    if (taskIndex !== undefined) {
      const taskControl = this.tasks.at(taskIndex);
      const field = taskControl.get(fieldName);
      return field ? field.invalid && field.touched : false;
    }
    
    const field = this.projectForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string, taskIndex?: number): string {
    if (taskIndex !== undefined) {
      const taskControl = this.tasks.at(taskIndex);
      const field = taskControl.get(fieldName);
      
      if (field?.errors) {
        if (field.errors['required']) return 'Este campo es requerido';
        if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
        if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
      }
    } else {
      const field = this.projectForm.get(fieldName);
      
      if (field?.errors) {
        if (field.errors['required']) return 'Este campo es requerido';
        if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
        if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
      }
    }
    
    return '';
  }
}
