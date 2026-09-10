import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// three.js needs a real GL backend in headless Chromium.
// 'angle' works on machines with a GPU; on a headless cloud box use 'swangle'
// (software ANGLE) — slower but reliable. Override per-render with
//   npx remotion render --gl=swangle
Config.setChromiumOpenGlRenderer('angle');
