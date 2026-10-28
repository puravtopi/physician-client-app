import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms-of-use.component.html',
  styleUrl: '../legal-page.css'
})
export class TermsOfUseComponent {}
