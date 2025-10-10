import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/register.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    registerForm!: FormGroup;

    constructor(private fb: FormBuilder, private registerService: RegisterService) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            organizationName: ['', Validators.required],
            description: [''],
            website: [''],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
            role: ['', Validators.required]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(control: AbstractControl) {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
    }



    onSubmit() {
        if (this.registerForm.valid) {
            const { confirmPassword, ...userData } = this.registerForm.value; // eliminamos confirmPassword

            console.log('Data being sent to backend:', userData);

            this.registerService.registerUser(userData).subscribe({
                next: (response) => {
                    console.log('Usuario registrado con éxito:', response);
                    alert('Registro exitoso');
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
