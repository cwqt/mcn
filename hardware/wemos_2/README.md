# registering a device to my.corrhizal.net

using http.

## connecting device to the internet
* Set device into Soft Access Point mode
* Connect to WiFi network 'mcn-XXXX'
* mDNS sets .local for easy connection
* Go to http://mcn-XXXX.local/
* Enter WiFi router credentials SSID/Password & save
* Disconnect

## registering device
* Set device to Station mode
* Reboot
* Device will connect to network using WiFi credentials
* Connect back to own WiFi
* Device will start own HTTP server
* Go to http://192.168.0.x
* Begin symmetric key exchange

## symmetric key exchange

Device requires an API to send data to backend, we must be able to validate the sender, message integrity & only allow data to be sent from this device, corresponding to a plant/garden.  
Achieved by using a JSON Web Token hashed with HS256 using a 4096-bit private key (that only the server knows).

* User creates plant on frontend, unique ObjectId is created
* An API key for this plant is created also

API key packs the following meta-data:

* __device_id__: `ObjectId`
* __device_type__: `plant | garden`

### exchanging keys

* Device is connected to WiFi router
* User navigates to local IP address of device & is prompted with inputs
* User copies generated API key from front-end and pastes into key text-area
* User clicks save, key saved to flash memory.
* JWT decoded by device, setting `device_id` & `device_type` in flash memory.

### transmitting data

Upon sending a request to the API, the device performs the following:

* Sets `x-device-id` header to the `device_id`.
* Sets `Content-Type` header to `text/plain`.
* Creates a JSON body with request data, measurements, events etc.
* Encrypts the data with the API key in the following method: 

encrypt(`data` + `device_id`, `SYMMETRIC_KEY`) using AES-128-CBC.

And example request for sending measurement data:

```
PUT /${device_type}/${device_id}/measurements HTTP/1.1
Host: api.my.corrhizal.net
Content-Type: text/plain

5LQPwBzEoh98HSaaaLwhA8yU/rUaGHfPgQo0L2bCec7qGnWnVTY5KnWoBPJuQ9SdNNW4tCPYmLKP4BvG42lRqYNrasp7HxRxLY0TEosQrcOX82+MsL13+mZvFkmgMzcI5P3lTohhIBIt/FTz79jHU1YEHdcgNrlNYcShCsqUsDguBK2CfEFY2qCEsJCVYFEX1BpSiT4EtJ/1giO7gviTvpRD5Ls87WsAI6Sw7ZQspPR+POQ8+ZfPysLv6ukgvBNyegkU2uGK4R0zMiM9/Ef+HLNkRZ4HWLOOduPb90xtgng=
```

### server receiving data

Upon receiving this data packet, the API will perform the following checks to validate authenticity.

* Get stored API key for `x-device-id`.
* Decrypt request body using JWT.
* Decode JWT and validate token data == `x-device-id`
* Decrypts request body to get the request data & stored `device_id`
* Validate request `device_id` == `x-device-id` == `stored_api_key_device_i`

This validates the sender & only allows this API key to send data from this device.