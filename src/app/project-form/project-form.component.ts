import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project, ProjectStage } from '../models/project-stage.model';

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

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
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
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      pedidoCobertura: ['', [Validators.required, Validators.minLength(10)]]
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
    if (this.projectForm.valid) {
      const projectData: Project = {
        id: this.generateId(),
        nombre: this.projectForm.value.nombre,
        descripcion: this.projectForm.value.descripcion,
        etapas: this.projectForm.value.etapas.map((stage: any) => ({
          id: this.generateId(),
          nombre: stage.nombre,
          fechaInicio: stage.fechaInicio,
          fechaFin: stage.fechaFin,
          pedidoCobertura: stage.pedidoCobertura
        })),
        fechaCreacion: new Date().toISOString()
      };

      console.log('Datos del proyecto:', projectData);
      alert('Proyecto creado exitosamente!');
      this.resetForm();
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
      }
    } else {
      const field = this.projectForm.get(fieldName);
      
      if (field?.errors) {
        if (field.errors['required']) return 'Este campo es requerido';
        if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    
    return '';
  }
}
