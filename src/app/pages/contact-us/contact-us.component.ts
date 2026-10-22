import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.services';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  inquiry = {
    name: '',
    email: '',
    phone: '',
    note: ''
  };

  isSubmitted = false;

  constructor(private api: ApiService) {}

  submitForm(form: NgForm): void {
    this.isSubmitted = false;
    // Call backend API to save inquiry
    this.api.post<number>('Inquiry/AddInquiry', this.inquiry).subscribe({
      next: () => {
        // backend returns 1 on success in the existing controller
        this.inquiry = {
          name: '',
          email: '',
          phone: '',
          note: ''
        };
        form.resetForm(this.inquiry);
        this.isSubmitted = true;
        // Optionally still open mail client for user to send the message
        // const subject = `New inquiry from ${this.inquiry.name}`;
        // const body = [
        //   `Name: ${this.inquiry.name}`,
        //   `Email: ${this.inquiry.email}`,
        //   `Phone: ${this.inquiry.phone || 'Not provided'}`,
        //   '',
        //   this.inquiry.message
        // ].join('\n');

        // const mailtoLink = `mailto:contact@appointmentbk.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        // // If you prefer not to open mail client, remove the next line
        // window.location.href = mailtoLink;
      },
      error: (err) => {
        console.error('Failed to save inquiry', err);
        // keep isSubmitted false so user can retry; optionally show UI feedback
      }
    });
  }
}
