import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const liveSprintsFlag = flag({
  key: 'live-sprints',
  adapter: vercelAdapter(),
});