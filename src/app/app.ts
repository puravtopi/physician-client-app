import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const route = this.getDeepestRoute(this.router.routerState.snapshot.root);
        const data = route?.data ?? {};
        const pageTitle = data['title'] ?? 'Professionals Booking';
        const pageDescription = data['description'] ?? 'Professionals Booking helps people discover trusted professionals and book appointments with ease.';
        const pageKeywords = data['keywords'] ?? 'professionals booking, professional appointment, healthcare, specialists';
        const canonicalUrl = `https://www.professionalsbooking.com${this.router.url}`;

        this.titleService.setTitle(pageTitle);
        this.metaService.updateTag({ name: 'description', content: pageDescription });
        this.metaService.updateTag({ name: 'keywords', content: pageKeywords });
        this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
        this.metaService.updateTag({ property: 'og:title', content: pageTitle });
        this.metaService.updateTag({ property: 'og:description', content: pageDescription });
        this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
        this.metaService.updateTag({ name: 'twitter:title', content: pageTitle });
        this.metaService.updateTag({ name: 'twitter:description', content: pageDescription });

        const canonicalTag = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (canonicalTag) {
          canonicalTag.href = canonicalUrl;
        }
      });
  }

  private getDeepestRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let currentRoute = route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute;
  }
}
