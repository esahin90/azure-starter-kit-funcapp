module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);

    eventHubMessages.forEach((message, index) => {
        // https://docs.microsoft.com/en-us/azure/digital-twins/how-to-egress-endpoints#event-types
        context.log(`Process message`);
        context.log(`Type = ${context.bindingData.propertiesArray[index].Type}`);
        context.log(`Data: ${JSON.stringify(message, null, ' ')}`);

        if (context.bindingData.propertiesArray[index].Type == `SpaceChange` &&
            message.DataType == `Humidity` &&
            message.Value > 60 ) {
            var ip_to_devices = [['100.100.200.54', '0c418f7a-03eb-4876-9dee-b14da656a162'],
                                 ['100.100.200.52', '95a8f243-21ba-4a49-b430-5949e74daf5d'],
                                 ['100.100.200.51', '5acc063b-e3df-43f0-903b-7b9450e9c4c2'],
                                 ['100.100.200.53', '278a7a11-02ae-47c9-98f0-b36dd62cb3e4']];
            const url = 'https://cb-zumtobel-lms-websocket.azurewebsites.net/api/v1/controllers/zumtobel-lms/devices/';
            var header = {token: "1"};
            const cmd = "/lightingcapability/setintensity/";

            for (var i=0; i < ip_to_devices.length; i++){
              header['lightNetworkAddress'] = ip_to_devices[i][0];
              fetch(url + ip_to_devices[i][0] + cmd + '100/3', {headers: header, method:"POST"})
            }

            for (var i=0; i < ip_to_devices.length; i++){
              header['lightNetworkAddress'] = ip_to_devices[i][0];
              fetch(url + ip_to_devices[i][0] + cmd + '0/3', {headers: header, method:"POST"})
            }
        }
    });
};
