# SpeedTrac
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

#### Note! This docker image is still in development! 

## Overview
SpeedTrac is a small docker image that periodically runs speed tests by utilising the [Speedtest® CLI](https://www.speedtest.net/apps/cli) application by Ookla. The results are then then uploaded to a InfluxDB (v2) instance via a NodeJs application.

The docker image is inspired by https://github.com/frdmn/docker-speedtest.

## Prerequisites
- Docker
- InfluxDB v2 Instance
  - [Docker Image](https://hub.docker.com/_/influxdb/) 

## Getting started
### Installation
Automated builds of the image.

``` bash
docker pull ghcr.io/dylanmccrimmon/speedtrac:latest
```

Build the image yourself directly from Git.

``` bash
docker build https://github.com/dylanmccrimmon/SpeedTrac.git --tag 'ghcr.io/dylanmccrimmon/speedtrac:dev'
```

### Quick Start
``` bash
docker run --name SpeedTrac \
  -e SPEEDTEST_INTERVAL=30 \
  -e SPEEDTEST_HOST=local \
  -e INFLUXDB_URL=YOUR_INFLUXDB_URL \
  -e INFLUXDB_ORG=YOUR_INFLUXDB_ORG \
  -e INFLUXDB_BUCKET=YOUR_INFLUXDB_BUCKET \
  -e INFLUXDB_TOKEN=YOUR_INFLUXDB_TOKEN \
  --restart unless-stopped \
  ghcr.io/dylanmccrimmon/speedtrac:latest
```

*Alternatively, you can use the sample [docker-compose.yml](docker-compose.yml) file to start the container using [Docker Compose](https://docs.docker.com/compose/).*


## Parameters

### SPEEDTEST_INTERVAL 
Set the interval between speed tests in seconds

```yaml
Type: Number
Required: False
Default value: 3600
```

### SPEEDTEST_HOST 
Sets the preferred Ookla Speedtest® server ID. For auto-selection, set as 'local'.

You may retrieve a list of the nearest server to you by running `speedtest --servers` on your device (requires [ Speedtest® CLI](https://www.speedtest.net/apps/cli) to be installed).

```yaml
Type: String or Number
Required: False
Default value: local
```

### INFLUXDB_URL 
Sets the InfluxDB URL that the image will use to send data to.

```yaml
Type: String
Required: True
Default value: "http://127.0.0.1:8086"
```

### INFLUXDB_ORG 
Sets the InfluxDB organisation that the InfluxDB Bucket belongs to.

[Documentation - InfluxDB - Manage organizations](https://docs.influxdata.com/influxdb/v2/admin/organizations/)

```yaml
Type: String
Required: True
```

### INFLUXDB_BUCKET 
Sets the InfluxDB bucket that the data will be added to.

[Documentation - InfluxDB - Manage buckets](https://docs.influxdata.com/influxdb/v2/admin/buckets/)

```yaml
Type: String
Required: True
```

### INFLUXDB_TOKEN 
Set the InfluxDB API token that will be used to authenticate with your InfluxDB instance.

[Documentation - InfluxDB - Manage API tokens](https://docs.influxdata.com/influxdb/v2/admin/tokens/)

> When creating your token in InfluxDB, it's recommend that the token is created so it can only `Write` data to the specific bucket you are sending data to. 

```yaml
Type: String
Required: True
```

## License
[Apache-2.0](https://choosealicense.com/licenses/apache-2.0/)

## To-Do
- [ ] Code clean-up