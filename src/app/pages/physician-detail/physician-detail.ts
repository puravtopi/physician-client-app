import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Physician } from '../../core/models/physician.model';
import { ApiService } from '../../core/services/api.services'; // Adjust path
import { Specialty } from '../../core/models/specialties.modal'; // Adjust path
import { PagedResponse } from '../../core/models/api-response.model'; // Adjust path
import { HttpParams } from '@angular/common/http';
import { IpService } from '../../core/services/ip.service'; // Adjust path
import { Leads } from '../../core/models/leads.model';


interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

interface PracticeLocation {
  name: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-physician-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './physician-detail.html',
  styleUrl: './physician-detail.css'
 })
export class PhysicianDetail implements OnInit {
  physician: Physician | null = null;
  reviews: Review[] = [];
  workingHours: string[] = [];
  practiceLocations: PracticeLocation[] = [];

  constructor(private route: ActivatedRoute,private ipService: IpService,
    private apiService: ApiService, private ctr:ChangeDetectorRef) {
  

  }

  ngOnInit(): void {
    // Use paramMap.subscribe instead of snapshot.paramMap
  // This "listens" for ID changes while the user is still on the component
  let ts=this;
  this.route.paramMap.subscribe(params => {
    const id = Number(params.get('id'));
    
    if (id) {
      // Clear old data so it doesn't flicker while loading the new one
      ts.physician = null; 
      
      // Call your API method
      ts.saveLeads(id);
      ts.getPhysicianById(id);
      ts.loadReviews(id);
      ts.loadWorkingHours(id);
    }
  });
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

  get fullAddress(): string {
    if (!this.physician) {
      return '';
    }

    return `${this.physician.location}`;
  }

  loadWorkingHours(id:number): void {
       
        let ts=this;
               
        debugger;
        // 1. Set up query parameters
        const params = new HttpParams()
          .set('id', id.toString());
        
    
        // 2. Call the API
        ts.apiService.get<string[]>('Physio/GetPhysiciansWorkingHours', params)
          .subscribe({
            next: (response: string[]) => {
              debugger
              ts.workingHours = response;
              ts.ctr.markForCheck();
            },
            error: (err) => {
              console.error('Error fetching physicians', err);
            }
          });
    

   
  }

  get websiteUrl(): string {
    const site = this.physician?.website?.trim();

    if (!site) {
      return 'NA';
    }

    return /^https?:\/\//i.test(site) ? site : `https://${site}`;
  }

  private buildPracticeLocations(physician: Physician): PracticeLocation[] {
    return [
      {
        name: physician.hospital ?? physician.location,
        address: `${physician.location}, ${physician.city}, ${physician.state} ${physician.zipCode}`,
        phone: physician.phone ?? 'Contact for details',
      },
    ];
  }

   loadReviews(id:number): void {
  
        let ts=this;
       
        
        debugger;
        // 1. Set up query parameters
        const params = new HttpParams()
          .set('id', id)
          .set('pageNumber', 1)
          .set('pageSize', 5); // Passing 0 to get all records as per your logic
    
        // 2. Call the API
        ts.apiService.get<PagedResponse<Review>>('Physio/GetPhysiciansReviews', params)
          .subscribe({
            next: (response) => {
             
              ts.reviews = response.data;
              ts.ctr.markForCheck();
            },
            error: (err) => {
              console.error('Error fetching physicians', err);
            }
          });
      }

  private buildReviews(physician: Physician): Review[] {
    return [
      {
        id: 1,
        author: 'Patient A.',
        rating: 5,
        date: 'March 2026',
        text: `${physician.name.split(' ').pop()} was professional, attentive, and explained everything clearly. Highly recommend for ${physician.specialty.toLowerCase()} care.`,
      },
      {
        id: 2,
        author: 'Patient B.',
        rating: 5,
        date: 'February 2026',
        text: 'Excellent experience from booking to follow-up. The office staff was friendly and wait times were minimal.',
      },
      {
        id: 3,
        author: 'Patient C.',
        rating: 4,
        date: 'January 2026',
        text: 'Very knowledgeable and caring. Helped me understand my treatment options and next steps.',
      },
    ];
  }

  saveLeads(id:number)
  {
    this.ipService.getIpAddress().subscribe({
    next: (res: any) => {
      // 2. Now you have the IP inside 'res.ip'
      const data: Leads = {
        iP_Address: res, // Use the value from the response
        placeId: id
      };

      console.log('Data ready to send:', data);

      // 3. Now call your AddLeads API
      this.apiService.post<number>('Leads/AddLeads', data).subscribe(result => {
        console.log('Saved to DB!');
      });
    },
    error: (err) => console.error('Could not get IP', err)
  });
  }

  getPhysicianById(id: number) {
        // 1. Set up query parameters
        const params = new HttpParams()
          .set('id', id);

          let ts=this;
    
        // 2. Call the API
        this.apiService.get<Physician>('Physio/GetPhysiciansById', params)
          .subscribe({
            next: (response) => {
             ts.physician=response;
             ts.ctr.markForCheck();
             
    // if (ts.physician) {
    //   ts.practiceLocations = ts.buildPracticeLocations(ts.physician);
    //   ts.reviews = ts.buildReviews(ts.physician);
    // }
             console.log('Physician Details', ts.physician);
            },
            error: (err) => {
              console.error('Error fetching physicians', err);
            }
          });
  }
}
