"use server";
import {kafka} from "packages/utils/kafka";

const producer = kafka.producer();

type Props = {
    userId?: string,
    productId?: string,
    shopId?: string,
    action: string,
    device?: string,
    country?: string,
    city?: string,
};

export const sendKafkaEvent = async(eventData: Props) => {
    try {
        await producer.connect();
        await producer.send({
            topic: "users-events",
            messages: [{value: JSON.stringify(eventData)}],
        });
    } catch (error) {
        console.log(error);
    } finally {
        await producer.disconnect();
    }
}