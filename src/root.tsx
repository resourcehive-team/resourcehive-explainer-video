import React from 'react';
import {Composition} from 'remotion';
import {Explainer, totalFrames} from './video';
import {FPS} from './data/scenes';

export const Root: React.FC = () => <Composition id="ResourceHiveExplainer" component={Explainer} durationInFrames={totalFrames} fps={FPS} width={1280} height={720}/>;
