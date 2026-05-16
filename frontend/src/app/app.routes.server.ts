import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Client  // login runs on CLIENT only
  },
  {
    path: 'camera',
    renderMode: RenderMode.Client  // camera runs on CLIENT only
  },
  {
    path: 'admin',
    renderMode: RenderMode.Client  // admin runs on CLIENT only
  },
  {
    path: 'all-images',
    renderMode: RenderMode.Client  // all-images runs on CLIENT only
  },
  {
    path: 'forbidden',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client  // everything runs on CLIENT
  }
];