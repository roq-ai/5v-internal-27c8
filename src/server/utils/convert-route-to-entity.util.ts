const mapping: Record<string, string> = {
  candidates: 'candidate',
  companies: 'company',
  jobs: 'job',
  kanbans: 'kanban',
  scores: 'score',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
