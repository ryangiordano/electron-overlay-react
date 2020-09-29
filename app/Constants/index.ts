import path from 'path';
import { app } from 'electron';
export const serverUrl = 'http://localhost:5000';

export const port = 5000;

export const localSlackURL = () =>
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '.', `/local-slack-data.json`)
    : path.join(app?.getPath('userData'), `/local-slack-data.json`);
