module.exports = function (RED) {
    RED.nodes.registerType('mqtt-config', function (cfg) {
        RED.nodes.createNode(this, cfg);
        const server = RED.nodes.getNode(cfg.server);
        if (server) {
            server.register(this)
            const { clientId } = cfg
            // 发布
            this.publish = (topic, payload) => {
                // 本地MQTT
                if (!clientId) return server.client.publish(topic, payload)

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
        }
    })
}