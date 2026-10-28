import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  allCities: string[] = [];
  allStates: string[] = [];
  filteredPhysicians: Physician[] = [];
  allSpecialties: Specialty[] = [];
  
  // Filter properties
  filters: PhysicianFilter = {
    specialty: '',
    location: '',
    city: '',
    state: '',
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
  hasSearchStarted = false;
  specialties: string[] = [];
  locations: string[] = [];
  city: string[] = [];
  state: string[] = [];
  minRatingOptions = [3.5, 4.0, 4.5];
  private zipOptionsCity = '';

  constructor(private apiService: ApiService,
  private ctr: ChangeDetectorRef,
  private route: ActivatedRoute,
  private router: Router
  ) {
   
    this.loadZips();
    this.loadCities();
    this.loadStates();
    this.loadSpecialties();

    
  }

    ngOnInit(): void {
      this.route.queryParamMap.subscribe({
        next: (params) => {
          const zipcode = params.get('zipCode') ?? '';
          const city = params.get('city') ?? (zipcode && !/\d/.test(zipcode) ? zipcode : '');
          const minRating = Number(params.get('minRating') ?? 0);
          const distance = Number(params.get('distance') ?? 10);
          const page = Number(params.get('page') ?? 1);
          const previousCity = this.filters.city ?? '';

          this.filters.searchQuery = params.get('search') ?? '';
          this.filters.specialty = params.get('specialty') ?? '';
          this.filters.city = city;
          this.filters.location = /^\d+$/.test(zipcode) ? zipcode : '';
          this.filters.state = params.get('state') ?? '';
          this.filters.minRating = Number.isFinite(minRating) && minRating > 0 ? minRating : 0;
          this.filters.distance = Number.isFinite(distance) && distance >= 0 ? distance : 10;
          this.filters.availableOnly = params.get('availableOnly') === 'true';
          this.filters.verifiedOnly = params.get('verifiedOnly') === 'true';
          this.filters.acceptsInsurance = params.get('acceptsInsurance') === 'true';
          this.hasSearchStarted = Boolean(
            this.filters.searchQuery ||
            this.filters.specialty ||
            this.filters.city ||
            this.filters.location ||
            this.filters.state ||
            this.filters.minRating ||
            this.filters.distance !== 10 ||
            this.filters.availableOnly ||
            this.filters.verifiedOnly ||
            this.filters.acceptsInsurance
          );
          this.currentPage = Number.isInteger(page) && page > 0 ? page : 1;

          if (previousCity !== city || (zipcode && this.zipOptionsCity !== city)) {
            this.zipOptionsCity = city;
            this.loadZips(city);
          }

          if (this.hasSearchStarted) {
            this.loadPhysicians(this.currentPage);
          } else {
            this.allPhysicians = [];
            this.filteredPhysicians = [];
            this.totalItems = 0;
            this.isLoading = false;
          }
          this.ctr.markForCheck();
        },
        error: (err) => console.error('Route error:', err)
    });

    
  }
  
    loadPhysicians(page: number = 1): void {

      let ts=this;
      let category= this.filters.specialty??'';
      let city= this.filters.city??'';
      let state= this.filters.state??'';
      let search= this.filters.searchQuery??'';
      let zipcode= this.filters.location??'';
      let minRating= this.filters.minRating??0;
      ts.currentPage = page;
      
      // 1. Set up query parameters
      const params = new HttpParams()
        .set('search', search)
        .set('category', category)
        .set('zipcode', zipcode)
        .set('city', city)
        .set('state', state)
        .set('minRating', minRating.toString())
        .set('pageNumber', this.currentPage.toString())
        .set('pageSize', this.pageSize.toString()); // Passing 0 to get all records as per your logic
  
      // 2. Call the API
      ts.isLoading = true;
      ts.ctr.markForCheck();
      ts.apiService.get<PagedResponse<Physician>>('Physio/GetPhysicians', params)
        .pipe(
          finalize(() => {
            ts.isLoading = false;
            ts.ctr.markForCheck();
          })
        )
        .subscribe({
          next: (response) => {
            ts.allPhysicians = response.data;
            ts.filteredPhysicians = [...this.allPhysicians]; 
            ts.totalItems = response.totalRecords; 
            ts.ctr.markForCheck();
            console.log('Loaded Professionals:', ts.allPhysicians);
          },
          error: (err) => {
            console.error('Error fetching physicians', err);
          }
        });
    }

    loadZips(city: string = '')
    {
      let ts=this;
       // 1. Set up query parameters
      const params = new HttpParams()
        .set('searchText', city)
        .set('pageNumber', "1")
        .set('pageSize', '1000');
       
         // Passing 0 to get all records as per your logic
  
      // 2. Call the API
      ts.apiService.get<PagedResponse<Zips>>('Specialties/GetZips', params)
        .subscribe({
          next: (response) => {
            if (city !== this.filters.city) {
              return;
            }
            ts.allZips = response.data;
            ts.locations = [...new Set(this.allZips.map(p => p.code.toString()))].sort();
            ts.ctr.markForCheck();
          },
          error: (err) => {
            console.error('Error fetching physicians', err);
          }
        });
    }

  loadCities()
    {
      let ts=this;
       // 1. Set up query parameters
      const params = new HttpParams()
        .set('searchText', '')
        .set('pageNumber', "1")
        .set('pageSize', '1000'); // Passing 0 to get all records as per your logic
  
      // 2. Call the API
      ts.apiService.get<PagedResponse<string>>('Specialties/GetCities', params)
        .subscribe({
          next: (response) => {
            ts.allCities = response.data;
            //ts.locations = [...new Set(this.allZips.map(p => p.code.toString()))].sort();
            ts.ctr.markForCheck();
          },
          error: (err) => {
            console.error('Error fetching physicians', err);
          }
        });
    }

   loadStates()
    {
      let ts=this;
       // 1. Set up query parameters
      const params = new HttpParams()
        .set('searchText', '')
        .set('pageNumber', "1")
        .set('pageSize', '1000'); // Passing 0 to get all records as per your logic
  
      // 2. Call the API
      ts.apiService.get<PagedResponse<string>>('Specialties/GetStates', params)
        .subscribe({
          next: (response) => {
            ts.allStates = response.data;
            //ts.locations = [...new Set(this.allZips.map(p => p.code.toString()))].sort();
            ts.ctr.markForCheck();
          },
          error: (err) => {
            console.error('Error fetching states', err);
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
          this.ctr.markForCheck();
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
  if (this.currentPage !== 1) this.updateFilterQueryParams(1);
}

goToPrevious() {
  if (this.currentPage > 1) {
    this.updateFilterQueryParams(this.currentPage - 1);
  }
}

goToNext() {
  if (this.currentPage < this.totalPages) {
    this.updateFilterQueryParams(this.currentPage + 1);
  }
}

goToLast() {
  if (this.totalPages > 0 && this.currentPage !== this.totalPages) {
    this.updateFilterQueryParams(this.totalPages);
  }
}  

applyFilters(): void {
    this.updateFilterQueryParams(1);
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onCityChange(): void {
    this.filters.location = '';
    this.zipOptionsCity = this.filters.city ?? '';
    this.loadZips(this.zipOptionsCity);
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      specialty: '',
      location: '',
      city: '',
      state: '',
      minRating: 0,
      distance: 10,
      availableOnly: false,
      verifiedOnly: false,
      acceptsInsurance: false,
      searchQuery: ''
    };
    this.loadZips();
    this.hasSearchStarted = false;
    this.filteredPhysicians = [];
    this.totalItems = 0;
    this.currentPage = 1;
    this.updateFilterQueryParams(1);
  }

  private updateFilterQueryParams(page: number): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.filters.searchQuery || null,
        specialty: this.filters.specialty || null,
        city: this.filters.city || null,
        zipCode: this.filters.location || null,
        state: this.filters.state || null,
        minRating: this.filters.minRating || null,
        distance: this.filters.distance !== 10 ? this.filters.distance : null,
        availableOnly: this.filters.availableOnly ? true : null,
        verifiedOnly: this.filters.verifiedOnly ? true : null,
        acceptsInsurance: this.filters.acceptsInsurance ? true : null,
        page: page > 1 ? page : null
      },
      replaceUrl: true
    }).catch((err) => console.error('Error updating physician filters in URL:', err));
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
