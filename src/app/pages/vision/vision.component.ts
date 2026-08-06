import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vision',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})
export class VisionComponent {
  readonly highlights = [
    {
      title: 'Mission',
      text: 'To empower service-based businesses with intelligent technology that attracts new customers, automates appointment booking, maximizes schedule utilization, and creates sustainable growth.'
    },
    {
      title: 'Vision',
      text: 'To create a future where every small business can access the same level of technology, marketing intelligence, and operational efficiency as large enterprises.'
    },
    {
      title: 'Purpose',
      text: 'To remove barriers between businesses and customers through intelligent automation and innovative software.'
    },
    {
      title: 'Philosophy',
      text: 'Technology should work for people, not the other way around, helping entrepreneurs focus on serving customers and growing their businesses.'
    }
  ];
}
