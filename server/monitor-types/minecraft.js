const { MonitorType } = require("./monitor-type");
const { UP } = require("../../src/util");
const mc = require('minecraft-protocol')


/**
 * Pings a Minecraft server and returns its status.
 *
 * @param {string} server Server address, e.g. "play.example.com:25565"
 * @returns {Promise<object>}
 */
function pingMinecraftServer(server) {
  return new Promise((resolve) => {
    const [host, portString] = server.split(':');
    const port = Number(portString) || 25565;

    const start = Date.now();

    mc.ping({
      host,
      port,
      closeOnError: true,
      timeout: 5000
    }, (err, result) => {
      if (err) {
        return resolve({
          online: false,
          latency: null,
          error: err.message
        });
      }

      resolve({
        online: true,
        latency: Date.now() - start,
        version: result.version,
        players: {
          online: result.players.online,
          max: result.players.max
        },
        motd: result.description
      });
    });
  });
}

class MinecraftMonitorType extends MonitorType {
    name = Minecraft;

    /**
     * Whether or not this type supports monitor conditions. Controls UI visibility in monitor form.
     * @type {boolean}
     */
    supportsConditions = false;

    /**
     * Variables supported by this type. e.g. an HTTP type could have a "response_code" variable to test against.
     * This property controls the choices displayed in the monitor edit form.
     * @type {import("../monitor-conditions/variables").ConditionVariable[]}
     */
    conditionVariables = [];

    /**
     * Allows setting any custom status to heartbeat, other than UP.
     * @type {boolean}
     */
    allowCustomStatus = false;

    /**
     * Run the monitoring check on the given monitor
     *
     * Successful cases: Should update heartbeat.status to "up" and set response time.
     * Failure cases: Throw an error with a descriptive message.
     * @param {Monitor} monitor Monitor to check
     * @param {Heartbeat} heartbeat Monitor heartbeat to update
     * @param {UptimeKumaServer} server Uptime Kuma server
     * @returns {Promise<void>}
     */
    async check(monitor, heartbeat, server) {
        const MinecraftStatus = await pingMinecraftServer(serverurl);

        if (status.online === true) {
            heartbeat.status = UP;
    // Do something here
        } else {
            throw new Error("server is offline or not reachble");
        }
      );
    }
}

module.exports = {
    MonitorType,
};
