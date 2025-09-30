import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project, ProjectStage, CreateProjectRequest, Task } from '../models/project-stage.model';
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
  collapsedStages: boolean[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {
    this.projectForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      ownerId: [1, [Validators.required, Validators.min(1)]],
      etapas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Agregar una etapa inicial
    this.addStage();
  }

  get etapas(): FormArray {
    return this.projectForm.get('etapas') as FormArray;
  }

  createStageFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['medium', Validators.required],
      dueDate: ['', Validators.required],
      estimatedHours: [1, [Validators.required, Validators.min(1)]],
      status: ['todo', Validators.required]
    });
  }

  addStage(): void {
    const stageFormGroup = this.createStageFormGroup();
    this.etapas.push(stageFormGroup);
    
    // Colapsar todas las etapas existentes
    this.collapsedStages = this.collapsedStages.map(() => true);
    // Nueva etapa inicia expandida
    this.collapsedStages.push(false);
    
    // Scroll automático a la nueva etapa después de un pequeño delay
    setTimeout(() => {
      this.scrollToNewStage();
    }, 100);
  }

  removeStage(index: number): void {
    if (this.etapas.length > 1) {
      this.etapas.removeAt(index);
      this.collapsedStages.splice(index, 1); // Remover también el estado de colapso
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Create API request object
      const apiProjectData: CreateProjectRequest = {
        name: this.projectForm.value.nombre,
        description: this.projectForm.value.descripcion,
        startDate: this.projectForm.value.fechaInicio,
        endDate: this.projectForm.value.fechaFin,
        ownerId: this.projectForm.value.ownerId,
        tasks: this.projectForm.value.etapas.map((stage: any) => ({
          title: stage.title,
          description: stage.description,
          priority: stage.priority,
          dueDate: stage.dueDate,
          estimatedHours: stage.estimatedHours,
          status: stage.status
        }))
      };

      console.log('Enviando datos al API:', apiProjectData);

      // Call the API
      this.projectService.createProject(apiProjectData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            console.log('Proyecto creado exitosamente:', response.data);
            alert(`${response.message}\nDatos enviados: ${JSON.stringify(apiProjectData, null, 2)}`);
            this.resetForm();
          } else {
            console.error('Error en la respuesta:', response.error);
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

    this.etapas.controls.forEach(control => {
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
    this.etapas.clear();
    this.collapsedStages = [];
    this.addStage();
  }

  toggleStageCollapse(index: number): void {
    const isCurrentlyCollapsed = this.collapsedStages[index];
    
    // Si la etapa está colapsada y se va a expandir, colapsar todas las demás
    if (isCurrentlyCollapsed) {
      // Colapsar todas las etapas
      this.collapsedStages = this.collapsedStages.map(() => true);
      // Expandir solo la etapa actual
      this.collapsedStages[index] = false;
    } else {
      // Si la etapa está expandida, colapsarla (mantener el comportamiento actual)
      this.collapsedStages[index] = true;
    }
  }

  isStageCollapsed(index: number): boolean {
    return this.collapsedStages[index] || false;
  }

  private scrollToNewStage(): void {
    const stagesContainer = document.querySelector('.stages-container');
    if (stagesContainer) {
      const lastStageCard = stagesContainer.querySelector('.stage-card:last-child');
      if (lastStageCard) {
        lastStageCard.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }

  isFieldInvalid(fieldName: string, stageIndex?: number): boolean {
    if (stageIndex !== undefined) {
      const stageControl = this.etapas.at(stageIndex);
      const field = stageControl.get(fieldName);
      return field ? field.invalid && field.touched : false;
    }
    
    const field = this.projectForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string, stageIndex?: number): string {
    if (stageIndex !== undefined) {
      const stageControl = this.etapas.at(stageIndex);
      const field = stageControl.get(fieldName);
      
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
