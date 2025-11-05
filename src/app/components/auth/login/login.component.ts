import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    const firstSection = this.authService.getFirstAvailableSection();
                    this.router.navigate(['/app', firstSection]);
                },
                error: (err) => {
                    console.error(err);
                    this.errorMessage = err.error?.message || 'Usuario o contraseña incorrectos';
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    goToRegister() {
        this.router.navigate(['/register']);
    }
}


