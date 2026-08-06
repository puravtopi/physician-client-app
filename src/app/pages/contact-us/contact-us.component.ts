import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  inquiry = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  isSubmitted = false;

  submitForm(): void {
    const subject = `New inquiry from ${this.inquiry.name}`;
    const body = [
      `Name: ${this.inquiry.name}`,
      `Email: ${this.inquiry.email}`,
      `Phone: ${this.inquiry.phone || 'Not provided'}`,
      '',
      this.inquiry.message
    ].join('\n');

    const mailtoLink = `mailto:contact@appointmentbk.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
    this.isSubmitted = true;
  }
}
