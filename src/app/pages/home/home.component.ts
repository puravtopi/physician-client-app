import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.services'; // Adjust path
import { Specialty } from '../../core/models/specialties.modal'; // Adjust path
import { PagedResponse } from '../../core/models/api-response.model'; // Adjust path
import { HttpParams } from '@angular/common/http';
import { Physician } from '../../core/models/physician.model';

interface SpecialtyOption {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  specialtyQuery = '';
  zipCode = '';
  showSuggestions = false;
  activeSuggestionIndex = -1;
  filteredSpecialties: SpecialtyOption[] = [];

  constructor(private router: Router,private apiService: ApiService) {
    this.loadSpecialties();
    this.loadPhysicians();
  }
  features = [
    {
      icon: '🔍',
      title: 'Find Expert Professionals',
      description: 'Access profiles of qualified professionals specializing in various fields.'
    },
    {
      icon: '⭐',
      title: 'Read Customers Reviews',
      description: 'Read genuine reviews from other customers to help you make informed decisions.'
    },
    {
      icon: '✓',
      title: 'Book Appointments Easily',
      description: 'Find the right professional and book appointments that fit your schedule.'
    }
  ];

  specialties: Specialty[] = [];
  physicians: Physician[] = [];

  /*specialties = [
    { name: 'Cardiology', icon: '❤️', description: 'Heart & Cardiovascular Health' },
    { name: 'Dermatology', icon: '🧴', description: 'Skin Care Specialists' },
    { name: 'Neurology', icon: '🧠', description: 'Neurological Conditions' },
    { name: 'Orthopedics', icon: '🦴', description: 'Bone & Joint Health' },
    { name: 'Pediatrics', icon: '👶', description: 'Children\'s Health Care' },
    { name: 'General Medicine', icon: '⚕️', description: 'Primary Care Physicians' },
    { name: 'Psychiatry', icon: '💭', description: 'Mental Health Services' },
    { name: 'Ophthalmology', icon: '👁️', description: 'Eye Care Specialists' },
    { name: 'Gynecology', icon: '👩‍⚕️', description: 'Women\'s Health' },
    { name: 'Urology', icon: '🔬', description: 'Urological Health' },
    { name: 'ENT', icon: '👂', description: 'Ear, Nose & Throat' },
    { name: 'Gastroenterology', icon: '🍽️', description: 'Digestive Health' }
  ];*/

  // physicians = [
  //   {
  //     name: 'Dr. Sarah Johnson',
  //     specialty: 'Cardiology',
  //     location: 'New York, NY',
  //     rating: 4.9,
  //     reviews: 248,
  //     image: '👩‍⚕️'
  //   },
  //   {
  //     name: 'Dr. Michael Chen',
  //     specialty: 'Orthopedics',
  //     location: 'Los Angeles, CA',
  //     rating: 4.8,
  //     reviews: 312,
  //     image: '👨‍⚕️'
  //   },
  //   {
  //     name: 'Dr. Emily Rodriguez',
  //     specialty: 'Neurology',
  //     location: 'Chicago, IL',
  //     rating: 4.9,
  //     reviews: 189,
  //     image: '👩‍⚕️'
  //   },
  //   {
  //     name: 'Dr. James Wilson',
  //     specialty: 'General Medicine',
  //     location: 'Houston, TX',
  //     rating: 4.7,
  //     reviews: 425,
  //     image: '👨‍⚕️'
  //   }
  // ];

  articles = [
    {
      title: 'Understanding Preventive Care',
      date: '2026-05-20',
      image: '📚'
    },
    {
      title: 'Managing Chronic Conditions',
      date: '2026-05-15',
      image: '📊'
    },
    {
      title: 'Wellness Tips for Busy Professionals',
      date: '2026-05-10',
      image: '💪'
    }
  ];

  testimonials = [
    {
      text: 'I found an amazing physician through this platform who understood my needs perfectly!',
      author: 'Jessica R.',
      rating: 5
    },
    {
      text: 'The booking process was so simple and the appointment was scheduled quickly.',
      author: 'Robert M.',
      rating: 5
    },
    {
      text: 'Great reviews helped me choose the right doctor for my family.',
      author: 'Maria L.',
      rating: 5
    }
  ];

  loadSpecialties() {
    // 1. Set up query parameters
    const params = new HttpParams()
      .set('searchText', '') // Empty string if no search
      .set('pageNumber', '1')
      .set('pageSize', '0'); // Passing 0 to get all records as per your logic

    // 2. Call the API
    this.apiService.get<PagedResponse<Specialty>>('Specialties/GetSpecialties', params)
      .subscribe({
        next: (response) => {
          // 3. Extract the array from the 'data' property of PagedResponse
          this.specialties = response.data;
          console.log('Loaded Specialties:', this.specialties);
        },
        error: (err) => {
          console.error('Error fetching specialties', err);
        }
      });
  }

  loadPhysicians() {
    // 1. Set up query parameters
    const params = new HttpParams()
      .set('searchText', '') // Empty string if no search
      .set('pageNumber', '1')
      .set('pageSize', '10'); // Passing 0 to get all records as per your logic

    // 2. Call the API
    this.apiService.get<PagedResponse<Physician>>('Physio/GetPhysicians', params)
      .subscribe({
        next: (response) => {
          // 3. Extract the array from the 'data' property of PagedResponse
          debugger;
          this.physicians = response.data;
          console.log('Loaded Physicians:', this.physicians);
        },
        error: (err) => {
          console.error('Error fetching physicians', err);
        }
      });
  }

  get canSearch(): boolean {
    return this.specialtyQuery.trim().length > 0 && /^\d{5}$/.test(this.zipCode);
  }

  onSpecialtyInput(): void {
    const query = this.specialtyQuery.trim().toLowerCase();
    this.activeSuggestionIndex = -1;

    if (!query) {
      this.filteredSpecialties = [...this.specialties];
    } else {
      this.filteredSpecialties = this.specialties.filter(
        s => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)
      );
    }

    this.showSuggestions = this.filteredSpecialties.length > 0;
  }

  onSpecialtyFocus(): void {
    this.onSpecialtyInput();
    this.showSuggestions = this.filteredSpecialties.length > 0;
  }

  onSpecialtyBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
      this.activeSuggestionIndex = -1;
    }, 150);
  }

  onSpecialtyKeydown(event: KeyboardEvent): void {
    if (!this.showSuggestions || !this.filteredSpecialties.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeSuggestionIndex = Math.min(
        this.activeSuggestionIndex + 1,
        this.filteredSpecialties.length - 1
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeSuggestionIndex = Math.max(this.activeSuggestionIndex - 1, 0);
    } else if (event.key === 'Enter' && this.activeSuggestionIndex >= 0) {
      event.preventDefault();
      this.selectSpecialty(this.filteredSpecialties[this.activeSuggestionIndex]);
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
      this.activeSuggestionIndex = -1;
    }
  }

  selectSpecialty(specialty: SpecialtyOption): void {
    this.specialtyQuery = specialty.name;
    this.showSuggestions = false;
    this.activeSuggestionIndex = -1;
  }

  onZipInput(): void {
    this.zipCode = this.zipCode.replace(/\D/g, '').slice(0, 5);
  }

  onSearch(): void {
    if (!this.canSearch) {
      return;
    }

    this.router.navigate(['/physicians'], {
      queryParams: {
        specialty: this.specialtyQuery.trim(),
        zipCode: this.zipCode
      }
    });
  }
}
