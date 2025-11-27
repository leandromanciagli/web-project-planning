import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-kpi-quick-access',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="kpi-quick-access" [class]="containerClass">
      <div class="quick-access-content">
        <div class="access-info">
          <h3 class="access-title">Dashboard de KPIs</h3>
          <p class="access-description">{{ description }}</p>
        </div>
        <button 
          class="access-btn"
          routerLink="/app/kpi-dashboard"
          [class]="buttonClass">
          <span class="btn-icon">📊</span>
          <span class="btn-text">{{ buttonText }}</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .kpi-quick-access {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 1.5rem;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .kpi-quick-access:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .kpi-quick-access.compact {
      padding: 1rem;
      border-radius: 8px;
    }

    .kpi-quick-access.minimal {
      background: white;
      border: 2px solid #667eea;
      color: #667eea;
      padding: 0.75rem 1rem;
    }

    .quick-access-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .access-info {
      flex: 1;
    }

    .access-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .minimal .access-title {
      font-size: 1rem;
      color: #667eea;
    }

    .access-description {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .minimal .access-description {
      color: #64748b;
    }

    .access-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      color: white;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      white-space: nowrap;
    }

    .access-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateX(4px);
    }

    .minimal .access-btn {
      background: #667eea;
      border-color: #667eea;
      color: white;
    }

    .minimal .access-btn:hover {
      background: #5a67d8;
      border-color: #5a67d8;
    }

    .compact .access-btn {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .btn-icon {
      font-size: 1.25rem;
    }

    .compact .btn-icon {
      font-size: 1rem;
    }

    .btn-text {
      font-size: 0.875rem;
    }

    .btn-arrow {
      transition: transform 0.3s ease;
    }

    .access-btn:hover .btn-arrow {
      transform: translateX(4px);
    }

    /* Responsive */
    @media (max-width: 640px) {
      .quick-access-content {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .access-btn {
        align-self: stretch;
        justify-content: center;
      }
    }
  `]
})
export class KpiQuickAccessComponent {
    @Input() description: string = 'Ver métricas detalladas de tareas del sistema';
    @Input() buttonText: string = 'Ver Dashboard';
    @Input() containerClass: string = '';
    @Input() buttonClass: string = '';
}