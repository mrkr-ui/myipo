import {Queue} from 'bullmq';

export const notificationQueue = new Queue( 'notification' ,{
    connection: {
        host: 'localhost',
        port: 6379
    }
})

//test code
async function main() {
    await queue.add('sendIpoAlert', {
        user_id: 1,
        ipo_name: 'all',               // or a specific IPO name
        filter: {
            gmp: { op: '>=', value: 0 },
            subscription: { op: '<=', value: 999999 }
        },
        phone: '+10000000000',
        email: 'test@example.com',
        alert_time: new Date().toISOString()
    }, {
        removeOnComplete: true
    });

    console.log('Test job added');
    await queue.close();
}
main().catch(err => { console.error(err); process.exit(1); });