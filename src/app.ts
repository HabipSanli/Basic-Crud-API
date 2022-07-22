import { initalizeExpress } from "./controller/expresscontroller";
import { initRabbit, startConsuming, sendMsg } from "./controller/rabbitmqcontroller";

async function main() {
	await initRabbit();
	await initalizeExpress();
}

main();
