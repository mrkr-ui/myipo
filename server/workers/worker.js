import 'dotenv/config';
import { Worker } from "bullmq";
// #region agent log
fetch('http://127.0.0.1:7508/ingest/80ad45cf-6c19-41c9-9065-208fa26788c2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4bd2e9'},body:JSON.stringify({sessionId:'4bd2e9',location:'worker.js:module-load',message:'worker module reached',data:{argv:process.argv,cwd:process.cwd()},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
// #endregion
//import { notificationQueue } from "./producer.js";
import { connection } from "./redis.js";


//const now = new Date().toISOString();

const conditions = {
  ">":  (threshold, current) => current > threshold,
  "<":  (threshold, current) => current < threshold,
  "=":  (threshold, current) => current === threshold,
  ">=": (threshold, current) => current >= threshold,
  "<=": (threshold, current) => current <= threshold,
};
//
 
// const pushNotificationSuccess = false;
// const smsSuccess = false;
// const emailSuccess = false;

export const notificationWorker = new Worker('notification', workerJobHandler, {
    connection,
});

console.log('Notification worker started, waiting for Redis and jobs...');

// #region agent log
notificationWorker.on('ready', () => {
    fetch('http://127.0.0.1:7508/ingest/80ad45cf-6c19-41c9-9065-208fa26788c2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4bd2e9'},body:JSON.stringify({sessionId:'4bd2e9',location:'worker.js:ready',message:'bullmq worker ready',data:{queueName:'notification'},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
});
notificationWorker.on('error', (err) => {
    fetch('http://127.0.0.1:7508/ingest/80ad45cf-6c19-41c9-9065-208fa26788c2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4bd2e9'},body:JSON.stringify({sessionId:'4bd2e9',location:'worker.js:error',message:'bullmq worker error',data:{error:err.message},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
});
// #endregion


async function workerJobHandler(job) {

    const {user_id, ipo_name, filter, phone, email, alert_time} = job.data;
    const now = new Date().toISOString();
    if (alert_time <= now ) {
        const fetchIpo = async () =>{
            try{
                const port = process.env.PORT || 5000;
                const res = await fetch(`http://localhost:${port}/ipoData`)
                const allipo = await res.json();
                return allipo || [];
            } catch (error){
            console.error("Error fetching IPO data:", error);
            return [];
            }
        }

        const allFetchedIpo = await fetchIpo();

        const sortedIpo = allFetchedIpo.sort((a,b) => a.name.localeCompare(b.name))
        
        const iposToCheck = ipo_name === 'all' ? sortedIpo : sortedIpo.filter(i => i.name === ipo_name);

        for (const ipo of iposToCheck) {
            if (!ipo) continue;

            const passGmp = filter?.gmp
            ? (conditions[filter.gmp.op] ?? (()=>false))(filter.gmp.value, ipo.gmp ?? 0)
            : true;

            const passSubscription = filter?.subscription
            ? (conditions[filter.subscription.op] ?? (()=>false))(filter.subscription.value, ipo.subscription ?? 0)
            : true;

            if (passGmp && passSubscription) {
            
            const messageLines = 'hello user,\n\n' + 
            `This is the alert for ${ipo.name} .\n` +
            `Here are the details of the IPO:\n` +
            `Name: ${ipo.name}\n` +
            `Subscription : ${ipo.subscription}\n` +
            `GMP: ${ipo.gmp}\n` +
            `Market Cap: ${ipo.marketCap}\n` +
            `Closing date: ${ipo.lastDateToApply}\n` +
            `Listing date: ${ipo.listingDate}\n` +
            `Price Band: ${ipo.priceBand}\n` +
            `No of shares: ${ipo.noOfShares}\n\n` +
            `Hope you found this helpful.\n\n` +
            `Best regards,\n` +
            `MyIPO Team`;

            console.log("Generated Message: \n", messageLines);
            //sms, email, push notification logic here
            }
        }
    }
}

notificationWorker.on('completed', (job) =>{
    console.log(`Job with id ${job?.id} has been completed`);
})

notificationWorker.on('failed', (job, err) =>{
    console.log(`Job with id ${job?.id} has failed with error ${err.message}`);
});

