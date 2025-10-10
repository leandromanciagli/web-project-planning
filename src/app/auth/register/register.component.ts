import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../services/register.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    registerForm!: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            nombre: ['', Validators.required],
            emailContacto: ['', [Validators.required, Validators.email]],
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
            direccion: ['', Validators.required],
            cuit: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
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
            console.log('Datos enviados:', this.registerForm.value);
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
