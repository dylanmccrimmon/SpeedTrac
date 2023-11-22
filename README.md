# SpeedTrac
#### Note! This docker image is still in development! 

Small docker image to run speedtest and send data to InfluxDB (v3)

## Download & Installation

### Build the image

``` bash
docker build https://github.com/dylanmccrimmon/SpeedTrac.git -t speedtrac-dev
```

### Docker Run

``` bash
docker run --name SpeedTrac \
  -e SPEEDTEST_INTERVAL=30 \
  -e SPEEDTEST_HOST=local \
  -e INFLUXDB_URL=YOUR_INFLUXDB_URL \
  -e INFLUXDB_ORG=YOUR_INFLUXDB_ORG \
  -e INFLUXDB_BUCKET=YOUR_INFLUXDB_BUCKET \
  -e INFLUXDB_TOKEN=YOUR_INFLUXDB_TOKEN \
  --restart unless-stopped \
  speedtrac-dev
```

### Or create a docker compose file

Make sure to edit options to your requirements.

``` yaml
version: "3"
services:
    SpeedTrac:
        tty: true
        container_name: SpeedTrac
        environment:
            - SPEEDTEST_INTERVAL=30
            - SPEEDTEST_HOST=local
            - INFLUXDB_URL=YOUR_INFLUXDB_URL
            - INFLUXDB_ORG=YOUR_INFLUXDB_ORG
            - INFLUXDB_BUCKET=YOUR_INFLUXDB_BUCKET
            - INFLUXDB_TOKEN=YOUR_INFLUXDB_TOKEN
        restart: unless-stopped
        image:  speedtrac-dev
```

### Create and run the docker containter

```
sudo docker compose up -d
```