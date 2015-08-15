/// <reference path="typings/autobahn/autobahn.d.ts" />
/// <reference path="typings/signalr/signalr.d.ts" />
module autobahnSignalR {

    class SignalRTransport implements autobahn.ITransport {
        private _info: {
            type: string;
            url: any;
            protocol: string;
        };

        private _connection: SignalR;

        private _options: ISignalRTransportDefinition;

        constructor(options: ISignalRTransportDefinition) {
            this._options = options;
            this.onopen = () => { };
            this.onmessage = () => { };
            this.onclose = () => { };

            this._options = this._options;
            this._connection = $.connection(this._options.url, this._options.queryString, this._options.logging);
            this._connection.received(this._onReceived);
            this._connection.error(this._onError);
            this._connection.disconnected(this._disconnected);

            this._info = {
                type: "signalR",
                url: null,
                protocol: "wamp.2.json"
            };

            var settings: ConnectionSettings =
                this._options.connectionSettings;

            this._connection.start(settings, this._onStart);
        }

        private _onReceived = (data: string) => {
            autobahn.log.debug("SignalR transport receive", data);
            var message = JSON.parse(data);
            this.onmessage(message);
        }

        private _onStart = () => {
            this._info.url = this._options.url;
            this.onopen();
        }

        private _onError = (error: string) => {
            var details: autobahn.ICloseEventDetails =
                <autobahn.ICloseEventDetails>{};

            details.reason = error;
            details.wasClean = false;

            this.onclose(details);
        }

        private _disconnected = (): void => {
            var details: autobahn.ICloseEventDetails =
                <autobahn.ICloseEventDetails>{};

            details.reason = "disconnected";
            details.wasClean = false;

            this.onclose(details);
        }

        onopen: () => void;
        onmessage: (message: any[]) => void;
        onclose: (details: autobahn.ICloseEventDetails) => void;

        get info(): any {
            return this._info;
        }

        public send(message: any) {
            var payload = JSON.stringify(message);
            autobahn.log.debug("SignalR transport send", payload);
            this._connection.send(payload);
        }

        public close(errorCode: number, reason: string) {
            this._connection.stop();
        }
    }

    export class SignalRTransportFactory implements autobahn.ITransportFactory {
        private _options;

        constructor(options: autobahn.IConnectionOptions) {
            this._options = options;

            autobahn.util.assert(options.url !== undefined, "options.url missing");
            autobahn.util.assert(typeof options.url === "string", "options.url must be a string");
        }

        create(): autobahn.ITransport {
            return new SignalRTransport(this._options);
        }

        get type(): string {
            return "SignalR";
        }
    }

    export interface ISignalRTransportDefinition extends autobahn.ITransportDefinition {
        connectionSettings: ConnectionSettings;
        queryString? : any;
        logging?: boolean;
    }
}

declare module "autobahnSignalR" {
    export = autobahnSignalR;
}