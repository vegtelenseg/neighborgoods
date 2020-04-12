import React from 'react';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

// Do not send notifications for local development
let stage = 'local';

if (process.env.NODE_ENV !== 'development') {
  stage = 'qa';
}

export const bugsnagClient = bugsnag({
  apiKey: '96159557f6359f52b1f2cd1ccea16c85',
  appType: 'client',
  releaseStage: stage,
  notifyReleaseStages: ['qa', 'production', 'staging', 'development'],
  autoCaptureSessions: false,
});
bugsnagClient.use(bugsnagReact, React);
