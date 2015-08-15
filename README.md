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
        });
};

connection.open();
```

Server-side:
```csharp
{
    IWampHost host = new WampHost();

    host.RegisterTransport(new SignalRTransport("http://localhost:7070/", "/signalr"),
                           new JTokenJsonBinding());

    IWampHostedRealm realm = host.RealmContainer.GetRealmByName("realm1");

    realm.Services.RegisterCallee(new AddService());

    host.Open();
}

public interface IAddService
{
    [WampProcedure("com.myapp.add2")]
    int Add2(int x, int y);
}

private class AddService : IAddService
{
    public int Add2(int x, int y)
    {
        return x + y;
    }
}
```
