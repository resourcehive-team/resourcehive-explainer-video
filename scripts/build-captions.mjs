import {spawnSync} from 'node:child_process';
const result=spawnSync('python',['scripts/align-captions.py'],{stdio:'inherit'});
process.exit(result.status??1);
