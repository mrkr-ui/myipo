import 'dotenv/config';
import cron from 'node-cron';
// #region agent log
fetch('http://127.0.0.1:7508/ingest/80ad45cf-6c19-41c9-9065-208fa26788c2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4bd2e9'},body:JSON.stringify({sessionId:'4bd2e9',location:'scheduler.js:module-load',message:'scheduler module reached before supabase import',data:{argv:process.argv,cwd:process.cwd()},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
// #endregion
import supabase from '../utils/supabase.js';
import {notificationQueue} from './producer.js';

// #region agent log
fetch('http://127.0.0.1:7508/ingest/80ad45cf-6c19-41c9-9065-208fa26788c2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4bd2e9'},body:JSON.stringify({sessionId:'4bd2e9',location:'scheduler.js:post-import',message:'scheduler imports succeeded',data:{supabaseOk:!!supabase},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
// #endregion

console.log('Alert scheduler started, polling ipo_alerts every minute...');

cron.schedule('* * * * *', async () =>{
    const now = new Date().toISOString();

    const {data:events} = await supabase
    .from('ipo_alerts')
    .select('*')
    .lte('alert_at', now)
    .eq('status', 'pending')

    // #region agent log
    fetch('http://127.0.0.1:7508/ingest/80ad45cf-6c19-41c9-9065-208fa26788c2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4bd2e9'},body:JSON.stringify({sessionId:'4bd2e9',location:'scheduler.js:cron-tick',message:'scheduler cron tick',data:{eventCount:events?.length??0,now},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    if (!events || events.length === 0) return;

    for(const event of events) {
        notificationQueue.add('sendIpoAlert', {
            user_id: event.user_id,
            ipo_name: event.ipo_name,
            filter: event.filter,
            alert_time: event.alert_at,
            phone : event.phone,
            email : event.email

            },
            {
                delay: Math.max(0, new Date(event.alert_at).getTime() - Date.now()),
                attempts: 3,
                backoff: {type: 'exponential', delay: 60000},
                removeOnComplete: true

            }
        )

        await supabase
        .from('ipo_alerts')
        .update({status: 'scheduled'})
        .eq('id', event.id)
    }
})