import cron from 'node-cron';
import {supabase} from '../utils/supabase.js';
import {notificationQueue} from './producer.js';

cron.schedule('* * * * *', async () =>{
    const now = new Date().toISOString();

    const {data:events} = await supabase
    .from('ipo_alerts')
    .select('*')
    .lte('alert_time', now)
    .eq('status', 'pending')

    if (!events || events.length === 0) return;

    for(const event of events) {
        notificationQueue.add('sendIpoAlert', {
            user_id: event.user_id,
            ipo_name: event.ipo_name,
            filter: event.filter,
            alert_time: event.alert_time,
            phone : event.phone,
            email : event.email

            },
            {
                delay: Math.max(0, new Date(event.alert_time).getTime() - Date.now()),
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