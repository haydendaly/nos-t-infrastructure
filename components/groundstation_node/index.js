const mqtt = require('mqtt');
// solclient, amqp10
const { argv } = require('yargs');
var START = false;

const main = (host, port) => {
    var client = mqtt.connect({ host: host, port: port });

    client.on('connect', function () {
        client.subscribe('topic/#', function (err) {
            if (err) {
                console.log(err);
            };
        });
    });

    client.on('message', function (topic, message) {
        switch (topic) {
            case 'topic/control':
                var message_obj = JSON.parse(message.toString());
                if (message_obj.properties.type === 'start') {
                    START = true;
                    console.log('Ground Station Started');
                } else if (message_obj.properties.type === 'stop') {
                    START = false;
                    console.log('Ground Station Stopped');
                };
            case 'topic/satellite':
                if (START) {
                    var message_obj = JSON.parse(message.toString());
                    message = {
                        name : "groundstation",
                        description : "Model simulating groundstation connected to all satellites.",
                        properties : {
                            relayed_observation : message_obj.properties.relayed_observation,
                            observation_origin : message_obj.properties.observation_origin,
                            message_source : message_obj.name
                        }
                    };
                    client.publish("topic/groundstation", JSON.stringify(message));
                }
        }
    });
}

if (['ip', 'port', 'sleep'].every(key => Object.keys(argv).includes(key))) {
    setTimeout(() => {
        main(argv.ip, argv.port);
    }, argv.sleep * 100);
} else {
    console.log('Invalid args provided');
    process.exit();
};