// Secret Sharz — persistent service-selection policy
// UI helper only. The caller must persist the resulting membership through a
// trusted/authorized domain service.

import { PRIMARY_STUDENT_SERVICES } from './serviceMembership';

export const SERVICE_SELECTION_COPY = Object.freeze({
  counselling: {
    title: 'Emotional Wellbeing',
    description: 'A safe space for wellbeing support and counselling.',
  },
  sen: {
    title: 'Learning Support',
    description: 'Support for learning, organisation and individual learning needs.',
  },
  career: {
    title: 'Career Planning',
    description: 'Explore interests, careers, courses, colleges and your next steps.',
  },
});

export function getInitialServiceOptions() {
  return PRIMARY_STUDENT_SERVICES.map((domain) => ({
    domain,
    ...SERVICE_SELECTION_COPY[domain],
  }));
}

export function getDashboardRouteForService(domain) {
  switch (domain) {
    case 'counselling':
      return '/dashboard/counselling';
    case 'sen':
      return '/dashboard/sen';
    case 'career':
      return '/dashboard/career';
    default:
      return '/dashboard';
  }
}

export function resolveStudentLanding({ memberships = [], fallbackRoute = '/dashboard' }) {
  const activePrimary = memberships.find(
    (membership) =>
      membership?.status === 'active' &&
      membership?.isPrimary &&
      PRIMARY_STUDENT_SERVICES.includes(membership.domain),
  );

  return activePrimary ? getDashboardRouteForService(activePrimary.domain) : fallbackRoute;
}
