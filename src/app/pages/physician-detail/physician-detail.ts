import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Physician } from '../../core/models/physician.model';

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
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './physician-detail.html',
  styleUrl: './physician-detail.css',
})
export class PhysicianDetail implements OnInit {
  physician: Physician | null = null;
  reviews: Review[] = [];
  practiceLocations: PracticeLocation[] = [];

  private readonly physicians: Physician[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      bio: 'Experienced cardiologist with 15+ years of practice. Specializes in preventive care and advanced cardiac treatment. Dr. Johnson is known for her patient-centered approach and commitment to helping patients manage heart health through evidence-based care.',
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
      hospital: 'New York Presbyterian',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Orthopedics',
      bio: 'Board-certified orthopedic surgeon with expertise in sports medicine and joint replacement. Dr. Chen helps patients recover from injuries and improve mobility through personalized treatment plans.',
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
      hospital: 'Hospital for Special Surgery',
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      bio: 'Dermatologist specializing in skin cancer prevention and cosmetic treatments. Dr. Rodriguez provides comprehensive skin care for patients of all ages.',
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
      hospital: 'Mount Sinai Medical Center',
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Neurology',
      bio: 'Neurologist with special focus on migraine management and neurological disorders. Dr. Wilson combines clinical expertise with compassionate care.',
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
      hospital: 'Columbia University Medical Center',
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      specialty: 'Pediatrics',
      bio: 'Pediatrician dedicated to child health and preventive medicine. Dr. Thompson creates a welcoming environment for families and focuses on long-term wellness.',
      rating: 4.9,
      reviewCount: 267,
      image: '👩‍⚕️',
      location: "Brooklyn Children's Health, Brooklyn",
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
      hospital: 'NYC Health + Hospitals',
    },
    {
      id: 6,
      name: 'Dr. Robert Martinez',
      specialty: 'Gastroenterology',
      bio: 'Gastroenterologist experienced in digestive health and endoscopic procedures. Dr. Martinez is accepting new patients and offers flexible scheduling.',
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
      hospital: 'NYU Langone Medical Center',
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.physician = this.physicians.find((p) => p.id === id) ?? null;

    if (this.physician) {
      this.practiceLocations = this.buildPracticeLocations(this.physician);
      this.reviews = this.buildReviews(this.physician);
    }
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

    return `${this.physician.location}, ${this.physician.city}, ${this.physician.state} ${this.physician.zipCode}`;
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
}
