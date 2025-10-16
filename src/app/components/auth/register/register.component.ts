import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, ValidatorFn, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '@/services/register.service';
import { Router } from '@angular/router';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
        ? { passwordMismatch: true }
        : null;
};

export function urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;
        try {
            new URL(value);
            return null;
        } catch {
            return { invalidUrl: true };
        }
    };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

    registerForm!: FormGroup;

    constructor(private fb: FormBuilder, private registerService: RegisterService, private router: Router) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            organizationName: ['', Validators.required],
            description: [''],
            website: ['', urlValidator()],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
            role: ['', Validators.required]
        }, {
            validators: passwordMatchValidator
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            const { confirmPassword, ...userData } = this.registerForm.value; // eliminamos confirmPassword

            console.log('Data being sent to backend:', JSON.stringify(userData, null, 2));

            console.log('Data being sent to backend:', userData);

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
                    alert('Ocurrió un error al registrarse');
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
