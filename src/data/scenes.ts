export const FPS = 30;

export type SceneDef = {id: string; title: string; voice: string; seconds: number; recording?: string};

export const scenes: SceneDef[] = [
  {id: 'intro', title: 'ResourceHive', voice: '01-intro', seconds: 20, recording: 'demo-01-catalogue'},
  {id: 'problem', title: 'Shared resources, one place', voice: '02-problem', seconds: 30},
  {id: 'overview', title: 'Discover · Check · Reserve', voice: '03-overview', seconds: 30, recording: 'demo-01-catalogue'},
  {id: 'workflow', title: 'A reservation from start to finish', voice: '04-product-workflow', seconds: 115, recording: 'demo-03-booking'},
  {id: 'bridge', title: 'What happens behind Confirm?', voice: '05-bridge', seconds: 24, recording: 'demo-03-booking'},
  {id: 'architecture', title: 'Four services, clear responsibilities', voice: '06-architecture', seconds: 84},
  {id: 'request', title: 'Follow the booking request', voice: '07-booking-request', seconds: 100},
  {id: 'deployment', title: 'One VM for the backend', voice: '08-deployment', seconds: 70},
  {id: 'close', title: 'ResourceHive', voice: '09-close', seconds: 36, recording: 'demo-05-admin-montage'},
];
