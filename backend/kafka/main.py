import json
from kafka import KafkaConsumer, KafkaProducer


def kafka_producer() -> KafkaProducer:
    producer = KafkaProducer(
        bootstrap_servers=['127.1.1.1:9092'],
        value_serializer=lambda x: json.dumps(x).encode('utf-8')
    )
    return producer

def kafka_consumer() -> KafkaConsumer:
    consumer = KafkaConsumer(
    'numtest',
     bootstrap_servers=['127.1.1.1:9092'],
     auto_offset_reset='earliest',
     enable_auto_commit=True,
     group_id='my-group',
     value_deserializer=lambda x: json.loads(x.decode('utf-8')))
    return consumer

if __name__ == "__main__":
    producer = kafka_producer()
    consumer = kafka_consumer()

    for i in range(100):
        producer.send('numtest', value={"key": f"{i}"})
    
    for message in consumer:
        print(message.value)
