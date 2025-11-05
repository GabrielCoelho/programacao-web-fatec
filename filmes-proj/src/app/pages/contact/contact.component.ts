import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  showSuccessMessage = false;

  subjects = [
    { value: 'filme-nao-encontrado', label: 'Filme não encontrado' },
    { value: 'sugestao-filme', label: 'Sugestão de filme' },
    { value: 'erro-informacoes', label: 'Erro nas informações' },
    { value: 'problema-tecnico', label: 'Problema técnico' },
    { value: 'feedback', label: 'Feedback geral' },
    { value: 'outro', label: 'Outro assunto' }
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      // Scroll para o primeiro campo com erro
      const firstInvalidControl = document.querySelector('.form-control.invalid');
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simula envio do formulário
    console.log('Formulário enviado:', this.contactForm.value);

    this.showSuccessMessage = true;
    this.submitted = false;
    this.contactForm.reset();

    // Scroll suave para o topo para ver a mensagem de sucesso
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Esconde mensagem de sucesso após 5 segundos
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }

  onReset(): void {
    this.submitted = false;
    this.contactForm.reset();
  }

  getCharacterCount(): number {
    return this.contactForm.get('message')?.value?.length || 0;
  }
}
