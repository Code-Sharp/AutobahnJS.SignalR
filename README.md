# AutobahnJS.SignaR
A SignalR transport for AutobahnJS, supported by a WampSharp router.

### Usage

```TypeScript
var transportName = "SignalR-longPolling";

autobahn.transports.register
    (transportName, autobahnSignalR.SignalRTransportFactory);

var options: autobahn.IConnectionOptions = {
    realm: "realm1",
    url: "http://localhost:7070/signalr",
    transports: [
        {
            type: transportName,
            url: "http://localhost:7070/signalr",
            connectionSettings: <ConnectionSettings>{
                transport: ["longPolling"]
            }
        }
    ]
};

var connection = new autobahn.Connection(options);

connection.onopen = session => {
    session.call<number>('com.myapp.add2', [2, 3]).then(
        res => {
            console.log("Result:", res);
        }
        );
};

connection.open();
```
