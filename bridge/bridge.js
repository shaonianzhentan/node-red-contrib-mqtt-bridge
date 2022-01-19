module.exports = function (RED) {
    RED.nodes.registerType('mqtt-bridge', function (cfg) {
        RED.nodes.createNode(this, cfg);
        const local = RED.nodes.getNode(cfg.local);
        const cloud = RED.nodes.getNode(cfg.cloud);
        if (local && cloud) {
            local.register(this)
            cloud.register(this)
            const { clientId } = local.client.options
            const local_topic = `nr-mqtt-bridge/${cloud.broker}/#`
            const cloud_topic = `nr-mqtt-bridge/${clientId}`
            // 监听本地操作，发送到云端
            local.subscribe(local_topic, { qos: 0 }, function (mtopic, mpayload, mpacket) {
                cloud.client.publish(mtopic, mpayload)
            })
            // 监听云端操作，发送到本地
            cloud.subscribe(cloud_topic, { qos: 0 }, function (mtopic, mpayload, mpacket) {
                const { topic, payload } = JSON.parse(mpayload)
                local.client.publish(topic, payload)
                // console.log(topic, payload)
            })
            this.send({
                payload: {
                    clientId
                }
            })
        } else {
            this.status({ fill: "red", shape: "ring", text: `MQTT未配置` });
        }
    })
}