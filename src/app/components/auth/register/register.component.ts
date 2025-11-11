import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, ValidatorFn, ValidationErrors, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '@/services/register.service';
import { RoleService } from '@/services/role.service';
import { Role } from '@/models/role.model';
import { Router } from '@angular/router';


@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

    registerForm!: FormGroup;
    availableRoles: Role[] = [];
    loadingRoles = false;

    constructor(
        private fb: FormBuilder, 
        private registerService: RegisterService, 
        private roleService: RoleService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator(), this.passwordMatchValidator()]],
            confirmPassword: ['', Validators.required],
            organizationName: ['', Validators.required],
            roles: this.fb.array([], this.minSelectedRolesValidator(1))
        });

        this.loadRoles();
    }

    loadRoles(): void {
        this.loadingRoles = true;
        this.roleService.getRoles().subscribe({
            next: (roles) => {
                this.availableRoles = roles;
                // Inicializar checkboxes para cada rol
                roles.forEach(() => {
                    this.rolesFormArray.push(this.fb.control(false));
                });
                this.loadingRoles = false;
            },
            error: (err) => {
                console.error('Error cargando roles:', err);
                this.loadingRoles = false;
            }
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            const { confirmPassword, roles, ...userData } = this.registerForm.value;

            // Obtener los IDs de los roles seleccionados
            const selectedRoleIds = this.getSelectedRoles();

            // Agregar roles al objeto userData
            userData.roles = selectedRoleIds;

            Object.keys(userData).forEach(key => {
                if (typeof userData[key] === 'string') {
                    userData[key] = userData[key].trim();
                }
            });

            this.registerService.registerUser(userData).subscribe({
                next: (response) => {
                    console.log('Usuario registrado con éxito:', response);
                    alert('Registro exitoso');
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    console.error('Error en el registro:', err);
                    const errorMessage = err.error?.message || err.error?.errors || 'Ocurrió un error al registrarse';
                    alert(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    getRoleControl(index: number): FormControl {
        return this.rolesFormArray.at(index) as FormControl;
    }

    getSelectedRoles(): string[] {
        const selectedRoles: string[] = [];
        this.rolesFormArray.controls.forEach((control, index) => {
            if (control.value) {
                selectedRoles.push(this.availableRoles[index].name);
            }
        });
        return selectedRoles;
    }

    minSelectedRolesValidator(min: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const formArray = control as FormArray;
            const selectedCount = formArray.controls.filter(c => c.value === true).length;
            return selectedCount < min ? { minRoles: { required: min, actual: selectedCount } } : null;
        };
    }

    passwordStrengthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null; // Si está vacío, el required se encargará

            const errors: ValidationErrors = {};

            // Verificar minúsculas
            if (!/[a-z]/.test(value)) {
                errors['passwordLowercase'] = true;
            }

            // Verificar mayúsculas
            if (!/[A-Z]/.test(value)) {
                errors['passwordUppercase'] = true;
            }

            // Verificar números
            if (!/[0-9]/.test(value)) {
                errors['passwordNumber'] = true;
            }

            // Verificar caracteres especiales
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                errors['passwordSpecial'] = true;
            }

            // Si hay errores, retornarlos
            return Object.keys(errors).length > 0 ? errors : null;
        };
    }

    passwordMatchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get('password')?.value;
            const confirmPassword = control.get('confirmPassword')?.value;
            return password && confirmPassword && password !== confirmPassword
                ? { passwordMismatch: true }
                : null;
        };
    }

    get rolesFormArray(): FormArray {
        return this.registerForm.get('roles') as FormArray;
    }
}
