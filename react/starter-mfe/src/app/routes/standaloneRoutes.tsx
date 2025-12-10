import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { HomePage } from '../../pages/HomePage/HomePage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
];

export const standaloneRoutes = routes;
