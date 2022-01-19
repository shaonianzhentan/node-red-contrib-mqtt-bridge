# node-red-contrib-mqtt-bridge
MQTT连接本地和云端

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://flows.nodered.org/node/node-red-contrib-mqtt-bridge)
[![NPM version](https://img.shields.io/npm/v/node-red-contrib-mqtt-bridge.svg?style=flat-square)](https://www.npmjs.com/package/node-red-contrib-mqtt-bridge)
![license](https://img.shields.io/github/license/shaonianzhentan/node-red-contrib-mqtt-bridge)
![visit](https://visitor-badge.glitch.me/badge?page_id=shaonianzhentan.node-red-contrib-mqtt-bridge&left_text=visit)

`MQTT Bridge` 部署到本地

```html
<script type="text/html" data-template-name="mqtt-config">
    <div class="form-row">
        <label for="node-config-input-server">MQTT</label>
        <select id="node-config-input-server"></select>
    </div>
</script>
```

```js
{
    server: { value: "", type: "mqtt-config", required: true }
}
```

```js

const server = RED.nodes.getNode(cfg.server);

// 发布
server.publish(topic, payload)

// 订阅
server.subscribe(topic, payload => {

})

```