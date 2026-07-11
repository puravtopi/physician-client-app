import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Physician, PhysicianFilter, PhysicianSort } from '../../core/models/physician.model';
import { ApiService } from '../../core/services/api.services'; // Adjust path
import { Specialty } from '../../core/models/specialties.modal'; // Adjust path
import { PagedResponse } from '../../core/models/api-response.model'; // Adjust path
import { HttpParams } from '@angular/common/http';



@Component({
  selector: 'app-physcio-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './physcio-list.html',
  styleUrl: './physcio-list.css',
})
export class PhyscioList implements OnInit {
  currentPage: number = 1;
  pageSize: number = 3;
  totalItems: number = 0; 
  allPhysicians: Physician[] = [];  
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

  constructor(private apiService: ApiService,private ctr:ChangeDetectorRef) {
    this.loadPhysicians(1);
    this.extractFilterOptions();
    //this.applyFilters();
   
  }

  ngOnInit(): void {
    //this.applyFilters();
  }
  
    loadPhysicians(page: number = 1) {

      this.currentPage = page;
      // 1. Set up query parameters
      const params = new HttpParams()
        .set('searchText', '') // Empty string if no search
        .set('pageNumber',this.currentPage.toString())
        .set('pageSize', this.pageSize.toString()); // Passing 0 to get all records as per your logic
  
      // 2. Call the API
      this.apiService.get<PagedResponse<Physician>>('Physio/GetPhysicians', params)
        .subscribe({
          next: (response) => {
           
            this.allPhysicians = response.data;
            this.totalItems = response.totalRecords; 
            console.log('Loaded Physicians:', this.allPhysicians);
            this.applyFilters();
             this.ctr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching physicians', err);
          }
        });
    }

  // Pagination Logic
get totalPages(): number {
  return Math.ceil(this.totalItems / this.pageSize);
}

goToFirst() {
  if (this.currentPage !== 1) this.loadPhysicians(1);
}

goToPrevious() {
  if (this.currentPage > 1) {
    this.loadPhysicians(this.currentPage - 1);
  }
}

goToNext() {
  if (this.currentPage < this.totalPages) {
    this.loadPhysicians(this.currentPage + 1);
  }
}

goToLast() {
  if (this.currentPage !== this.totalPages) {
    this.loadPhysicians(this.totalPages);
  }
}  

  extractFilterOptions(): void {
    // Extract unique specialties
    this.specialties = [...new Set(this.allPhysicians.map(p => p.specialty))].sort();
    
    // Extract unique locations/cities
    this.locations = [...new Set(this.allPhysicians.map(p => p.city))].sort();
  }

  applyFilters(): void {
    let filtered = [...this.allPhysicians];
    debugger;
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
    // if (this.filters.distance) {
    //   filtered = filtered.filter(p => p.distance <= this.filters.distance!);
    // }

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
      console.log('Loaded Filter Physicians:', this.filteredPhysicians);
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
