import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateProjectRequest } from '@/models/project-task.model';
import { ProjectService } from '@/services/project.service';
import { TaskTypeService } from '@/services/taskType.service';
import { AuthService } from '@/services/auth.service';
import { Router } from '@angular/router';

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
  isLoading = true;
  taskTypes: any[] = [];

  private startDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const selectedDateStr = control.value;
    const [year, month, day] = selectedDateStr.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    selectedDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    if (selectedDate < today) {
      return { startDateInPast: true };
    }
    
    return null;
  }

  // Custom validator for end date
  private endDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }
    
    const startDate = this.projectForm.get('startDate')?.value;
    
    if (!startDate) {
      return null; // Can't validate if start date is not set yet
    }
    
    // Parse date strings and create date objects in local timezone
    const endDateStr = control.value;
    const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    endDate.setHours(0, 0, 0, 0);
    
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const startDateObj = new Date(startYear, startMonth - 1, startDay);
    startDateObj.setHours(0, 0, 0, 0);
    
    if (endDate < startDateObj) {
      return { endDateBeforeStart: true };
    }
    
    return null;
  }

  // Custom validator for task due date (must be >= project start date and <= project end date)
  private taskDueDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const projectStartDate = this.projectForm.get('startDate')?.value;
    const projectEndDate = this.projectForm.get('endDate')?.value;
    
    if (!projectStartDate || !projectEndDate) {
      return null; // Can't validate if project dates are not set yet
    }

    // Parse date strings and create date objects in local timezone
    const dueDateStr = control.value;
    const [dueYear, dueMonth, dueDay] = dueDateStr.split('-').map(Number);
    const dueDate = new Date(dueYear, dueMonth - 1, dueDay);
    dueDate.setHours(0, 0, 0, 0);
    
    const [startYear, startMonth, startDay] = projectStartDate.split('-').map(Number);
    const startDateObj = new Date(startYear, startMonth - 1, startDay);
    startDateObj.setHours(0, 0, 0, 0);
    
    const [endYear, endMonth, endDay] = projectEndDate.split('-').map(Number);
    const endDateObj = new Date(endYear, endMonth - 1, endDay);
    endDateObj.setHours(0, 0, 0, 0);

    if (dueDate < startDateObj) {
      return { dueDateBeforeProjectStart: true };
    }
    
    if (dueDate > endDateObj) {
      return { dueDateAfterProjectEnd: true };
    }

    return null;
  }

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private taskTypeService: TaskTypeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      ong: [this.authService.getUser()?.id, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', [Validators.required, this.startDateValidator.bind(this)]],
      endDate: ['', [Validators.required, this.endDateValidator.bind(this)]],
      tasks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadTaskTypes();    
    this.addTask();
    
    // Add reactive validation for end date when start date changes
    this.projectForm.get('startDate')?.valueChanges.subscribe(() => {
      this.projectForm.get('endDate')?.updateValueAndValidity();
      // Also revalidate all task due dates when start date changes
      this.tasks.controls.forEach(taskCtrl => {
        taskCtrl.get('dueDate')?.updateValueAndValidity();
      });
    });

    // Revalidate all task due dates when project end date changes
    this.projectForm.get('endDate')?.valueChanges.subscribe(() => {
      this.tasks.controls.forEach(taskCtrl => {
        taskCtrl.get('dueDate')?.updateValueAndValidity();
      });
    });
  }

  loadTaskTypes() {
    this.isLoading = true;
    this.taskTypeService.getAll().subscribe(
      {
        next: (data: any) => {          
          this.taskTypes = data;
          this.isLoading = false;
        },
        error: (e: any) => {
          console.log(e);
          this.isLoading = false;
        }
      }
    );
  }

  createTaskFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['medium', Validators.required],
      dueDate: ['', [Validators.required, this.taskDueDateValidator.bind(this)]],
      estimatedHours: [1, [Validators.required, Validators.min(1)]],
      taskTypeId: ['', Validators.required],
      isCoverageRequest: [false]
    });
  }

  addTask(): void {
    const taskFormGroup = this.createTaskFormGroup();
    this.tasks.push(taskFormGroup);
    
    // Colapsar todas las tasks existentes
    this.collapsedTasks = this.collapsedTasks.map(() => true);
    // Nueva etapa inicia expandida
    this.collapsedTasks.push(false);
    
    if (this.tasks.length > 1) {            
      // Scroll automático a la nueva etapa después de un pequeño delay
      setTimeout(() => {
        this.scrollToNewTask();
      }, 100);
    }
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
        ownerId: this.projectForm.value.ong,
        name: this.projectForm.value.name,
        description: this.projectForm.value.description,
        startDate: this.projectForm.value.startDate,
        endDate: this.projectForm.value.endDate,
        tasks: this.projectForm.value.tasks.map((task: any) => ({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          estimatedHours: task.estimatedHours,
          taskTypeId: task.taskTypeId,
          isCoverageRequest: task.isCoverageRequest
        }))
      };

      console.log('Enviando datos al API:', apiProjectData);

      // Call the API
      this.projectService.createProject(apiProjectData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          if (response.success) {
            // console.log('Proyecto creado exitosamente:', response.data);
            alert(response.message);
            this.resetForm();
            this.router.navigate(['/app/my-projects']);
          } else {
            // console.error('Error en la respuesta:', response.error);
            alert(`Error: ${response.message || response.error}`);
          }
        },
        error: (error: any) => {
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
      ong: ''
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
        if (field.errors['startDateInPast']) return 'La fecha de inicio no puede ser anterior a la fecha actual';
        if (field.errors['endDateBeforeStart']) return 'La fecha de fin no puede ser anterior a la fecha de inicio';
        if (field.errors['dueDateAfterProjectEnd']) return 'La fecha de vencimiento no puede superar la fecha de fin del proyecto';
        if (field.errors['dueDateBeforeProjectStart']) return 'La fecha de vencimiento no puede ser anterior a la fecha de inicio del proyecto';
      }
    } else {
      const field = this.projectForm.get(fieldName);
      
      if (field?.errors) {
        if (field.errors['required']) return 'Este campo es requerido';
        if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
        if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
        if (field.errors['startDateInPast']) return 'La fecha de inicio no puede ser anterior a la fecha actual';
        if (field.errors['endDateBeforeStart']) return 'La fecha de fin no puede ser anterior a la fecha de inicio';
      }
    }
    
    return '';
  }

  get ong() {
    return this.projectForm.get('ong')!;
  }

  get tasks(): FormArray {
    return this.projectForm.get('tasks') as FormArray;
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getMinEndDate(): string {
    const startDate = this.projectForm.get('startDate')?.value;
    if (startDate) {
      return startDate;
    }
    return this.getTodayDate();
  }

  getMinTaskDueDate(): string {
    const startDate = this.projectForm.get('startDate')?.value;
    if (startDate) {
      return startDate;
    }
    return this.getTodayDate();
  }

  getMaxTaskDueDate(): string {
    const endDate = this.projectForm.get('endDate')?.value;
    if (endDate) {
      return endDate;
    }
    return '';
  }
}
