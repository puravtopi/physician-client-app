import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Physician, PhysicianFilter, PhysicianSort } from '../../core/models/physician.model';

@Component({
  selector: 'app-physcio-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './physcio-list.html',
  styleUrl: './physcio-list.css',
})
export class PhyscioList implements OnInit {
  // Mock data - Replace with API call later
  allPhysicians: Physician[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      bio: 'Experienced cardiologist with 15+ years of practice. Specializes in preventive care and advanced cardiac treatment.',
      rating: 4.8,
      reviewCount: 342,
      image: '👩‍⚕️',
      location: 'New York Medical Center, Manhattan',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      distance: 0.5,
      languages: ['English', 'Spanish'],
      experience: 15,
      verified: true,
      acceptsInsurance: true,
      availableSlots: 3,
      phone: '(555) 123-4567',
      email: 'sarah.johnson@nycmedical.com',
      hospital: 'New York Presbyterian'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Orthopedics',
      bio: 'Board-certified orthopedic surgeon with expertise in sports medicine and joint replacement.',
      rating: 4.9,
      reviewCount: 289,
      image: '👨‍⚕️',
      location: 'Manhattan Orthopedic Clinic, Manhattan',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      distance: 1.2,
      languages: ['English', 'Mandarin'],
      experience: 18,
      verified: true,
      acceptsInsurance: true,
      availableSlots: 2,
      phone: '(555) 234-5678',
      email: 'michael.chen@ortho.com',
      hospital: 'Hospital for Special Surgery'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      bio: 'Dermatologist specializing in skin cancer prevention and cosmetic treatments.',
      rating: 4.7,
      reviewCount: 156,
      image: '👩‍⚕️',
      location: 'NYC Dermatology Associates, Midtown',
      city: 'New York',
      state: 'NY',
      zipCode: '10017',
      distance: 2.1,
      languages: ['English', 'Spanish', 'Portuguese'],
      experience: 12,
      verified: true,
      acceptsInsurance: false,
      availableSlots: 5,
      phone: '(555) 345-6789',
      email: 'emily.rodriguez@dermatology.com',
      hospital: 'Mount Sinai Medical Center'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Neurology',
      bio: 'Neurologist with special focus on migraine management and neurological disorders.',
      rating: 4.6,
      reviewCount: 198,
      image: '👨‍⚕️',
      location: 'Columbia Neurology Center, Upper West Side',
      city: 'New York',
      state: 'NY',
      zipCode: '10024',
      distance: 3.4,
      languages: ['English', 'French'],
      experience: 14,
      verified: true,
      acceptsInsurance: true,
      availableSlots: 1,
      phone: '(555) 456-7890',
      email: 'james.wilson@neurology.com',
      hospital: 'Columbia University Medical Center'
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      specialty: 'Pediatrics',
      bio: 'Pediatrician dedicated to child health and preventive medicine. Welcoming environment for families.',
      rating: 4.9,
      reviewCount: 267,
      image: '👩‍⚕️',
      location: 'Brooklyn Children\'s Health, Brooklyn',
      city: 'New York',
      state: 'NY',
      zipCode: '11201',
      distance: 4.8,
      languages: ['English'],
      experience: 11,
      verified: true,
      acceptsInsurance: true,
      availableSlots: 4,
      phone: '(555) 567-8901',
      email: 'lisa.thompson@peds.com',
      hospital: 'NYC Health + Hospitals'
    },
    {
      id: 6,
      name: 'Dr. Robert Martinez',
      specialty: 'Gastroenterology',
      bio: 'Gastroenterologist experienced in digestive health and endoscopic procedures.',
      rating: 4.5,
      reviewCount: 134,
      image: '👨‍⚕️',
      location: 'NYU Gastroenterology, East Village',
      city: 'New York',
      state: 'NY',
      zipCode: '10003',
      distance: 1.8,
      languages: ['English', 'Spanish'],
      experience: 16,
      verified: false,
      acceptsInsurance: true,
      availableSlots: 2,
      phone: '(555) 678-9012',
      email: 'robert.martinez@gastro.com',
      hospital: 'NYU Langone Medical Center'
    },
  ];

  filteredPhysicians: Physician[] = [];
  
  // Filter properties
  filters: PhysicianFilter = {
    specialty: '',
    location: '',
    minRating: 0,
    distance: 10,
    availableOnly: false,
    verifiedOnly: false,
    acceptsInsurance: false,
    searchQuery: ''
  };

  // Sort
  sortBy: PhysicianSort = {
    by: 'rating',
    order: 'desc'
  };

  // UI State
  sidebarOpen = true;
  specialties: string[] = [];
  locations: string[] = [];
  minRatingOptions = [3.5, 4.0, 4.5];

  constructor() {
    this.extractFilterOptions();
    this.applyFilters();
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  extractFilterOptions(): void {
    // Extract unique specialties
    this.specialties = [...new Set(this.allPhysicians.map(p => p.specialty))].sort();
    
    // Extract unique locations/cities
    this.locations = [...new Set(this.allPhysicians.map(p => p.city))].sort();
  }

  applyFilters(): void {
    let filtered = [...this.allPhysicians];

    // Search query
    if (this.filters.searchQuery?.trim()) {
      const query = this.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.specialty.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.bio.toLowerCase().includes(query)
      );
    }

    // Specialty filter
    if (this.filters.specialty) {
      filtered = filtered.filter(p => p.specialty === this.filters.specialty);
    }

    // Location filter
    if (this.filters.location) {
      filtered = filtered.filter(p => p.city === this.filters.location);
    }

    // Rating filter
    if (this.filters.minRating && this.filters.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= this.filters.minRating!);
    }

    // Distance filter
    if (this.filters.distance) {
      filtered = filtered.filter(p => p.distance <= this.filters.distance!);
    }

    // Available only
    if (this.filters.availableOnly) {
      filtered = filtered.filter(p => p.availableSlots > 0);
    }

    // Verified only
    if (this.filters.verifiedOnly) {
      filtered = filtered.filter(p => p.verified);
    }

    // Insurance filter
    if (this.filters.acceptsInsurance) {
      filtered = filtered.filter(p => p.acceptsInsurance);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (this.sortBy.by) {
        case 'rating':
          compareValue = b.rating - a.rating;
          break;
        case 'distance':
          compareValue = a.distance - b.distance;
          break;
        case 'experience':
          compareValue = b.experience - a.experience;
          break;
        case 'reviews':
          compareValue = b.reviewCount - a.reviewCount;
          break;
      }

      return this.sortBy.order === 'asc' ? compareValue : -compareValue;
    });

    this.filteredPhysicians = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      specialty: '',
      location: '',
      minRating: 0,
      distance: 10,
      availableOnly: false,
      verifiedOnly: false,
      acceptsInsurance: false,
      searchQuery: ''
    };
    this.applyFilters();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getRatingStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('½');
      } else {
        stars.push('☆');
      }
    }
    return stars;
  }
}
