'use client';

interface ErrorPageProps {
  error: Error; // contain some information about exactly what went wrong.
  reset: () => void; // automatically refresh a route.
}

export default function ErrorPage({ error }: ErrorPageProps) {
  return <div>{error.message}</div>;
}
