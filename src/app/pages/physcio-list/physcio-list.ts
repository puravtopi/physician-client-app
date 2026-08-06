import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Physician, PhysicianFilter, PhysicianSort } from '../../core/models/physician.model';
import { ApiService } from '../../core/services/api.services'; // Adjust path
import { Specialty } from '../../core/models/specialties.modal'; // Adjust path
import { Zips } from '../../core/models/zips.model'; // Adjust path
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
  pageSize: number = 9;
  totalItems: number = 0; 
  allPhysicians: Physician[] = [];  
  allZips: Zips[] = [];
  filteredPhysicians: Physician[] = [];
  allSpecialties: Specialty[] = [];
  
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
  isLoading = false;
  specialties: string[] = [];
  locations: string[] = [];
  minRatingOptions = [3.5, 4.0, 4.5];

  constructor(private apiService: ApiService,
  private ctr: ChangeDetectorRef,
  private route: ActivatedRoute
  ) {
   
    this.loadZips();
    this.loadSpecialties();

    
  }

    ngOnInit(): void {
    // 3. Use an Arrow Function (params) => { } 
    // This preserves the 'this' context automatically.
    this.route.queryParamMap.subscribe({
      next: (params) => {
        
        // 4. Handle Null vs Undefined (Fixes TS2345)
        const category = params.get('specialty') ?? undefined;
        const zipcode = params.get('zipCode') ?? undefined;

        console.log('Category:', category, 'Zip:', zipcode);

        if (category || zipcode) {
          this.allPhysicians = []; 
           this.filters.location=zipcode ?? '';
           this.filters.specialty=category ?? '';   
          // 5. Call your methods using 'this'
          this.loadPhysicians(1);
               
        }
      },
      error: (err) =>console.error('Route error:', err)
    });

    
  }
  
    loadPhysicians(page: number = 1): void {

      let ts=this;
      let category= this.filters.specialty??'';
      let zipcode= this.filters.location??'';
      let minRating= this.filters.minRating??0;
      ts.currentPage = page;
      
      // 1. Set up query parameters
      const params = new HttpParams()
        .set('category', category)
        .set('zipcode', zipcode)
        .set('minRating', minRating.toString())
        .set('pageNumber', this.currentPage.toString())
        .set('pageSize', this.pageSize.toString()); // Passing 0 to get all records as per your logic
  
      // 2. Call the API
      ts.isLoading = true;
      ts.ctr.detectChanges();
      ts.apiService.get<PagedResponse<Physician>>('Physio/GetPhysicians', params)
        .pipe(
          finalize(() => {
            ts.isLoading = false;
            ts.ctr.detectChanges();
          })
        )
        .subscribe({
          next: (response) => {
            ts.allPhysicians = response.data;
            ts.filteredPhysicians = [...this.allPhysicians]; 
            ts.totalItems = response.totalRecords; 
             ts.ctr.detectChanges();
            console.log('Loaded Professionals:', ts.allPhysicians);
          },
          error: (err) => {
            console.error('Error fetching physicians', err);
          }
        });
    }

    loadZips()
    {
      let ts=this;
       // 1. Set up query parameters
      const params = new HttpParams()
        .set('searchText', '')
        .set('pageNumber', "1")
        .set('pageSize', '1000'); // Passing 0 to get all records as per your logic
  
      // 2. Call the API
      ts.apiService.get<PagedResponse<Zips>>('Specialties/GetZips', params)
        .subscribe({
          next: (response) => {
            ts.allZips = response.data;
            ts.locations = [...new Set(this.allZips.map(p => p.code.toString()))].sort();
            ts.ctr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching physicians', err);
          }
        });
    }

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
          this.allSpecialties = response.data;
         // Initialize filteredPhysicians with allPhysicians
          console.log('Loaded Specialties:', this.allSpecialties);
          this.specialties = [...new Set(this.allSpecialties.map(p => p.name))].sort();
          this.ctr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching specialties', err);
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

applyFilters(): void {
   
    this.loadPhysicians(1); // Reload physicians based on current filters and page
    // ;
    // // Search query
    // if (this.filters.searchQuery?.trim()) {
    //   const query = this.filters.searchQuery.toLowerCase();
     
    // }

    // // Specialty filter
    // if (this.filters.specialty) {
    //   filtered = filtered.filter(p => p.specialty === this.filters.specialty);
    // }

    // // Location filter
    // // if (this.filters.location) {
    // //   filtered = filtered.filter(p => p.city === this.filters.location);
    // // }

    // // Rating filter
    // // if (this.filters.minRating && this.filters.minRating > 0) {
    // //   filtered = filtered.filter(p => p.rating >= this.filters.minRating!);
    // // }

    // // Distance filter
    // // if (this.filters.distance) {
    // //   filtered = filtered.filter(p => p.distance <= this.filters.distance!);
    // // }

    // // Available only
    // if (this.filters.availableOnly) {
    //   filtered = filtered.filter(p => p.availableSlots > 0);
    // }

    // // Verified only
    // if (this.filters.verifiedOnly) {
    //   filtered = filtered.filter(p => p.verified);
    // }

    // // Insurance filter
    // if (this.filters.acceptsInsurance) {
    //   filtered = filtered.filter(p => p.acceptsInsurance);
    // }

    // // Apply sorting
    // filtered.sort((a, b) => {
    //   let compareValue = 0;

    //   switch (this.sortBy.by) {
    //     case 'rating':
    //       compareValue = b.rating - a.rating;
    //       break;
    //     case 'distance':
    //       compareValue = a.distance - b.distance;
    //       break;
    //     case 'experience':
    //       compareValue = b.experience - a.experience;
    //       break;
    //     case 'reviews':
    //       compareValue = b.reviewCount - a.reviewCount;
    //       break;
    //   }

    //   return this.sortBy.order === 'asc' ? compareValue : -compareValue;
    // });

    // this.filteredPhysicians = filtered;
    //   console.log('Loaded Filter Physicians:', this.filteredPhysicians);
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
