import { Worker } from "bullmq";
import { notificationQueue } from "./producer.js";


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

export const notificationWorker = new Worker('notification',workerJobHandler, {
    connection: {
        host: 'localhost',
        port: 6379
    }
});


async function workerJobHandler(job) {

    const {user_id, ipo_name, filter, phone, email, alert_time} = job.data;
    const now = new Date().toISOString();
    if (alert_time <= now ) {
        const fetchIpo = async () =>{
            try{
                const res = await fetch('http://localhost:4000/ipoData')
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


        }
        // const passGmp = filter?.gmp ? conditions[filter?.gmp?.op](filter?.gmp?.value, ipo?.gmp ?? 0) : true;
        // const passSubscription = conditions[filter?.subscription?.op](filter?.subscription?.value, ipo?.subscription);
        const passGmp = filter?.gmp
        ? (conditions[filter.gmp.op] ?? (()=>false))(filter.gmp.value, ipo.gmp ?? 0)
        : true;

        const passSubscription = filter?.subscription
        ? (conditions[filter.subscription.op] ?? (()=>false))(filter.subscription.value, ipo.subscription ?? 0)
        : true;


        if ( passGmp && passSubscription && (ipo || ipo_name === 'all')){
            
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

notificationWorker.on('completed', (job) =>{
    console.log(`Job with id ${job?.id} has been completed`);
})

notificationWorker.on('failed', (job, err) =>{
    console.log(`Job with id ${job?.id} has failed with error ${err.message}`);
});

