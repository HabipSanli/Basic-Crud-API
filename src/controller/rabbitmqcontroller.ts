import amqp from "amqplib";

const PORT = 5672;
let acon: amqp.Connection;
let channel : amqp.Channel;
const cID = Math.random.toString();

export async function initRabbit(){
	acon = await amqp.connect(`amqp://localhost:${PORT}`);
	channel = await acon.createChannel()
	channel.assertQueue('rpc',{durable : true});
    channel.assertQueue('name',{exclusive : true});
    console.log('Connection initialized.');
	return channel;
}

export async function onMsg(){
    channel.consume('name', (msg)=>{
        if(msg !== null){
            console.log(msg.content);
        }else{
            console.log('Something failed on Message.');
        }
    })
}

export async function sendMsg(msg : string) {
    channel.sendToQueue('rpc',Buffer.from(msg),{persistent : true, replyTo : 'name', correlationId : cID})
}

export async function getChannel() {
    if(channel === null){
        initRabbit().then((val)=>{
            return val;
        })
    }else{
        return channel;
    }
}