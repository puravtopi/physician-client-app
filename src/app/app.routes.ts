import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/layout/main-layout/main-layout')
        .then(m => m.MainLayout),
    data: {
      title: 'Professionals Booking | Find Trusted Professionals & Book Appointments',
      description: 'Find qualified professionals, compare specialties, and schedule appointments with Professionals Booking.',
      keywords: 'professionals booking, professional appointment, healthcare, specialists, book professional, professional directory'
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component')
            .then(m => m.HomeComponent),
        data: {
          title: 'Professionals Booking | Home',
          description: 'Discover trusted professionals and book appointments online in minutes.',
          keywords: 'professionals booking, professional appointment, healthcare, specialists, book professional, professional directory' 
        }
      },
      {
        path: 'physicians',
        loadComponent: () =>
          import('./pages/physcio-list/physcio-list')
            .then(m => m.PhyscioList),
        data: {
          title: 'Find Professionals | Professionals Booking',
          description: 'Browse top professionals by specialty, location, and expertise to find the right expert for your needs.',
          keywords: 'find professional, professional list, specialist directory, book professional appointment'
        }
      },
      {
        path: 'physicians/:id',
        loadComponent: () =>
          import('./pages/physician-detail/physician-detail')
            .then(m => m.PhysicianDetail),
        data: {
          title: 'Professional Profile | Professionals Booking',
          description: 'View professional details, credentials, specialties, and appointment information.',
          keywords: 'professional profile, physician details, medical specialist profile, appointment info'
        }
      },
      {
        path: 'vision',
        loadComponent: () =>
          import('./pages/vision/vision.component')
            .then(m => m.VisionComponent),
        data: {
          title: 'Our Vision | Professionals Booking',
          description: 'Learn about our mission to simplify healthcare access and patient-doctor connections.',
          keywords: 'healthcare vision, patient access, physician mission, healthcare innovation'
        }
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('./pages/contact-us/contact-us.component')
            .then(m => m.ContactUsComponent),
        data: {
          title: 'Contact Us | Professionals Booking',
          description: 'Get in touch with Professionals Booking for appointment support, questions, and healthcare inquiries.',
          keywords: 'contact professionals booking, healthcare support, professional booking help, contact us'
        }
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./pages/legal/privacy-policy/privacy-policy.component')
            .then(m => m.PrivacyPolicyComponent),
        data: {
          title: 'Privacy Policy | AppointmentBK',
          description: 'Learn how AppointmentBK handles information you provide when using our website.',
          keywords: 'privacy policy, AppointmentBK, personal information'
        }
      },
      {
        path: 'terms-of-use',
        loadComponent: () =>
          import('./pages/legal/terms-of-use/terms-of-use.component')
            .then(m => m.TermsOfUseComponent),
        data: {
          title: 'Terms of Use | AppointmentBK',
          description: 'Review the terms that apply when you use the AppointmentBK website.',
          keywords: 'terms of use, AppointmentBK, website terms'
        }
      }]
  }
];
