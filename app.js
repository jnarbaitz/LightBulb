const aws = require('aws-sdk');
const awsIot = require('aws-iot-device-sdk');
const readline = require('readline');

//pause function to be able to simulate incoming sensor data each second
function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) {}
}

//config of S3
const s3 = new aws.S3({
  accessKeyId: 'AKIAISSFKN2J3IEKBK7A',
  secretAccessKey: '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',
  Bucket: 'hw-1-data-sets'
})

//config of device
const device = awsIot.device({
   keyPath: './certs/3adaf717af-private.pem.key',
  certPath: './certs/3adaf717af-certificate.pem.crt',
    caPath: './certs/rootCA.pem',
  clientId: 'LightBulb',
      host: 'a1axlnrr7mncs0.iot.us-west-2.amazonaws.com'
})

//config of "sensor data"
const dataFile = {
  Bucket: 'hw-1-data-sets', 
  Key: 'data.txt'
}

//readline stream
const rl = readline.createInterface({
    input: s3.getObject(dataFile).createReadStream()
})

//turn on device
device.on('connect', function() {
    console.log('connect')
})

//read each line
rl.on('line', function(line) {
  console.log("Temp is " + line)
  
  //publish line to thing
  device.publish('LightBulbPolicy', JSON.stringify({ key1: line}))
  
  //pause
  pause(1000)
})
.on('close', function() {
})