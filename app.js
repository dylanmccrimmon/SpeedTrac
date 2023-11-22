const execa = require("execa");
const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const delay = require("delay");

process.env.INFLUXDB_URL = (process.env.INFLUXDB_URL) ? process.env.INFLUXDB_URL : 'http://127.0.0.1:8086';
process.env.SPEEDTEST_HOST = (process.env.SPEEDTEST_HOST) ? process.env.SPEEDTEST_HOST : 'local';
process.env.SPEEDTEST_INTERVAL = (process.env.SPEEDTEST_INTERVAL) ? process.env.SPEEDTEST_INTERVAL : 3600;

const bitToMbps = bit => (bit / 1000 / 1000) * 8;

const log = (message, severity = "Info") =>
  console.log(`[${severity.toUpperCase()}][${new Date()}] ${message}`);

// Check if env has required data
let badEnv = false 
const checkEnvArray = ['INFLUXDB_URL', 'INFLUXDB_ORG', 'INFLUXDB_BUCKET', 'INFLUXDB_TOKEN'];
for (let i = 0; i < checkEnvArray.length; i++) {
  if ((typeof(process.env[checkEnvArray[i]]) == 'undefined') && (process.env[checkEnvArray[i]] == null)) {
    log(
      `The env name ${checkEnvArray[i]} doesn't contain a value or has not been configured. The app will exit`,
      'error'
      )

    badEnv = true  
  }
}

// If bad env exist, exit application
if (badEnv) {

  log(
    `Exiting due to bad env values`,
    'error'
    )
    process.exit(1);

}

// Run speedtest cli and return object of results
const getSpeedMetrics = async () => {
  const args = (process.env.SPEEDTEST_SERVER) ?
    [ "--accept-license", "--accept-gdpr", "-f", "json", "--server-id=" + process.env.SPEEDTEST_SERVER] :
    [ "--accept-license", "--accept-gdpr", "-f", "json" ];

  const { stdout } = await execa("speedtest", args);
  const result = JSON.parse(stdout);
  return {
    upload_bandwidth: bitToMbps(result.upload.bandwidth),
    upload_latency_low: result.upload.latency.low,
    upload_latency_high: result.upload.latency.high,
    upload_latency_jitter: result.upload.latency.jitter,
    download_bandwidth: bitToMbps(result.download.bandwidth),
    download_latency_low: result.download.latency.low,
    download_latency_high: result.download.latency.high,
    download_latency_jitter: result.download.latency.jitter,
    ping_jitter: result.ping.jitter,
    ping_latency: result.ping.latency,
    ping_low: result.ping.low,
    ping_high: result.ping.high,
    packet_loss: result.packetLoss,
    speedtest_server_id: result.server.id
  };
};

// Send data to Influx
const pushToInflux = async (influx, metrics) => {

    const timestamp = new Date();
    let writeClient = influx.getWriteApi(process.env.INFLUXDB_ORG, process.env.INFLUXDB_BUCKET, 'ns')
    for (let [measurement, value] of Object.entries(metrics)) {
      let point = new Point(measurement)
            .intField('value', value)
            .timestamp(timestamp);
      log(`Writing value '${value}' to '${measurement}' in InfluxDB`);
      await writeClient.writePoint(point);
    }

};

// Main Script
(async () => {
  try {

    const influx = new InfluxDB({
      url: process.env.INFLUXDB_URL,
      token: process.env.INFLUXDB_TOKEN,
    });

    while (true) {
        log("Starting speedtest...");
        const speedMetrics = await getSpeedMetrics();
        log(
            `Speedtest results - Download: ${speedMetrics.download_bandwidth}, Upload: ${speedMetrics.upload_bandwidth}, Ping: ${speedMetrics.ping_latency}`
        );
        console.log(speedMetrics);
        await pushToInflux(influx, speedMetrics);

        log(`Sleeping for ${process.env.SPEEDTEST_INTERVAL} seconds...`);
        await delay(process.env.SPEEDTEST_INTERVAL * 1000);
    }

  } catch (err) {

    console.error(err.message);
    process.exit(1);

  }
})();
