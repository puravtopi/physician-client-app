import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
   {
    path: 'physicians/:id',
    renderMode: RenderMode.Server // This is the fix! 
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
