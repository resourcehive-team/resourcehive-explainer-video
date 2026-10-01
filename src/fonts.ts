import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
const handle=delayRender('Load the actual ResourceHive fonts');
Promise.all([
  new FontFace('Geist',`url(${staticFile('fonts/geist-latin.woff2')})`,{weight:'100 900'}).load(),
  new FontFace('Instrument Serif',`url(${staticFile('fonts/instrument-serif-latin.woff2')})`,{weight:'400'}).load(),
]).then(fonts=>{fonts.forEach(font=>(document.fonts as FontFaceSet & {add: (face:FontFace)=>void}).add(font));continueRender(handle)}).catch(cancelRender);

