import {Queue} from 'bullmq';
import { connection } from './redis.js';

// #region agent log
fetch('http://127.0.0.1:7508/ingest/80ad45cf-6c19-41c9-9065-208fa26788c2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4bd2e9'},body:JSON.stringify({sessionId:'4bd2e9',location:'producer.js:module-load',message:'producer module loading',data:{argv:process.argv,cwd:process.cwd()},timestamp:Date.now(),hypothesisId:'B',runId:'post-fix-v2'})}).catch(()=>{});
// #endregion

export const notificationQueue = new Queue('notification', {
    connection,
})

// #region agent log
fetch('http://127.0.0.1:7508/ingest/80ad45cf-6c19-41c9-9065-208fa26788c2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4bd2e9'},body:JSON.stringify({sessionId:'4bd2e9',location:'producer.js:module-ready',message:'producer queue created, no test main on import',data:{queueName:'notification'},timestamp:Date.now(),hypothesisId:'B',runId:'post-fix'})}).catch(()=>{});
// #endregion