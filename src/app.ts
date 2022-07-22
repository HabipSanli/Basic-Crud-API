import { initalizeExpress } from './controller/expresscontroller';
import { initRabbit, onMsg, sendMsg } from './controller/rabbitmqcontroller';

initRabbit();
initalizeExpress();
