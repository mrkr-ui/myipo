import {Queue} from 'bullmq';
import { connection } from './redis.js';



export const notificationQueue = new Queue('notification', {
    connection,
})
