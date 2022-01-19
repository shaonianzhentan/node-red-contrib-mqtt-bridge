module.exports = function (RED) {
    RED.nodes.registerType('mqtt-config', function (cfg) {
        RED.nodes.createNode(this, cfg);
        const server = RED.nodes.getNode(cfg.server);
        if (server) {
            server.register(this)
            const { clientId } = cfg

            let subscribe_prefix = `nr-mqtt-bridge/${server.broker}/`
            let publish_prefix = `nr-mqtt-bridge/${clientId}`
            if (!clientId) {
                subscribe_prefix = publish_prefix = 'nodered-mqtt-bridge/'
            }

            // 发布
            this.publish = (topic, payload) => {
                // 本地MQTT
                if (!clientId) {
                    return server.client.publish(topic, payload)
                }

                // 云端MQTT协议
                const type = Object.prototype.toString.call(payload)
                switch (type) {
                    case '[object Uint8Array]':
                        return;
                    case '[object Object]':
                        payload = JSON.stringify(payload)
                        break;
                    case '[object Number]':
                        payload = String(payload)
                        break;
                }
                server.client.publish(`nr-mqtt-bridge/${clientId}`, JSON.stringify({ topic, payload }))
            }
            // 订阅
            this.subscribe = (topic, callback) => {
                server.subscribe(topic, { qos: 0 }, function (mtopic, mpayload, mpacket) {
                    callback(mpayload)
                })
            }
            // 订阅前缀
            this.subscribe_topic = (topic) => subscribe_prefix + topic
            // 发布前缀
            this.publish_topic = (topic) => publish_prefix + topic
        }
    })
}