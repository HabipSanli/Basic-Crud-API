import amqp from "amqplib";

const PORT = 5672;
let channel: amqp.Channel;

export async function initRabbit() {
	const acon = await amqp.connect(`amqp://localhost:${PORT}`);
	channel = await acon.createChannel();
	channel.assertQueue("rpc", { durable: true });
    channel.assertQueue("name", { exclusive: true });
	console.log("Connection initialized.");
	return channel;
}

export async function startConsuming() {
	channel.consume("name", (msg) => {
		if (msg !== null) {
			console.log(msg.content.toString());
		} else {
			console.log("Something failed on Message.");
		}
	});
}

export async function sendMsg(msg: string) {
    if (!channel) {
        initRabbit();
	}
    const cID = Math.random.toString();
	channel.sendToQueue("rpc", Buffer.from(msg), { persistent: true, replyTo: 'name', correlationId: cID });
}

export async function getChannel() {
	if (!channel) {
		const channel = await initRabbit();
		return channel;
	} else {
		return channel;
	}
}
