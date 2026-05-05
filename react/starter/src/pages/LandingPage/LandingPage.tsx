import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ROUTES } from '@/app/routes/routes';
import styles from './LandingPage.module.scss';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <header className={styles.nav}>
        <span className={styles.navLogo}>React Starter</span>
        <div className={styles.navLinks}>
          <Link to={ROUTES.LOGIN}>
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="default" size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Enterprise React Starter</span>
          <h1 className={styles.heroTitle}>
            Build faster.<br />
            Ship with confidence.
          </h1>
          <p className={styles.heroSubtitle}>
            A modern React starter with atomic design, SOLID principles,
            TypeScript, and a scalable feature-based architecture — ready for
            production from day one.
          </p>
          <div className={styles.heroActions}>
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="default" size="lg">Get Started</Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="ghost" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.codeBlock}>
            <span className={styles.codeLine}><em>import</em> {'{ Button }'} <em>from</em> <b>'@/components/ui'</b></span>
            <span className={styles.codeLine}><em>import</em> {'{ useAuth }'} <em>from</em> <b>'@/features/auth'</b></span>
            <span className={styles.codeLine}>&nbsp;</span>
            <span className={styles.codeLine}><em>const</em> {'App = () => ('}</span>
            <span className={styles.codeLine}>&nbsp;&nbsp;{'<Button variant="default">'}</span>
            <span className={styles.codeLine}>&nbsp;&nbsp;&nbsp;&nbsp;{'Hello, World 👋'}</span>
            <span className={styles.codeLine}>&nbsp;&nbsp;{'</Button>'}</span>
            <span className={styles.codeLine}>{')'}</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything you need to ship</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to build?</h2>
        <p className={styles.ctaSubtitle}>
          Jump straight into the dashboard and start exploring.
        </p>
        <Link to={ROUTES.DASHBOARD}>
          <Button variant="default" size="lg">Open Dashboard</Button>
        </Link>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 React Starter. Built with React, TypeScript &amp; Vite.</p>
      </footer>
    </div>
  );
};

const FEATURES = [
  {
    icon: '⚛️',
    title: 'Atomic Design',
    description:
      'Components organized as atoms, molecules, organisms, and templates — reusable from the ground up.',
  },
  {
    icon: '🏗️',
    title: 'SOLID Principles',
    description:
      'Every module follows Single Responsibility, Open/Closed, and Dependency Inversion to stay maintainable.',
  },
  {
    icon: '🔐',
    title: 'Auth Ready',
    description:
      'Protected routes, AuthContext, and a fully typed auth service layer included out of the box.',
  },
  {
    icon: '⚡',
    title: 'Vite + React 19',
    description:
      'Lightning-fast HMR, lazy-loaded routes, and code splitting configured from the start.',
  },
  {
    icon: '🎨',
    title: 'SCSS Modules',
    description:
      'Scoped styles with CSS custom properties for theming — no class name collisions.',
  },
  {
    icon: '🧭',
    title: 'React Router v7',
    description:
      'Data-router with protected routes, redirect-back-after-login, and a single route constant source.',
  },
];

export default LandingPage;
