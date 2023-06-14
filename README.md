# Compute Starter Kit TypeScript KV Store

Fastly KV Store is a globally consistent key-value storage accessible across the Fastly Network. This makes it possible for your Compute@Edge application to read and write from KV Stores. The application shows how to use Fastly KV Store within a TypeScript Compute@Edge application.

**For more details about other starter kits for Compute@Edge, see the [Fastly developer hub](https://developer.fastly.com/solutions/starters)**

## Understanding the code

### [./src/index.ts](./src/index.ts)

This is the entry point of the application, an event-listener is attached to the `fetch` event, which calls the application code and include some generic exception handling, which would print any uncaught exception to the stderr and return a response with a HTTP 500 status to the user-agent.

### [./src/app.ts](./src/app.ts)

This is where the majority of our application code lives. A single async function is exported named `app`, which is the function that recieves the incoming `FetchEvent` and returns a `Response` instance, which will be sent to the user-agent.

## Deploying the project to Fastly

Note that Fastly Services have to have unique names within a Fastly Account.

To create and deploy to a new Fastly Service run the command and follow the instructions:

```shell
fastly compute publish
```

That is it, we now have a Fastly Service, a Fastly KV Store and have them linked together!

You can view real-time logs for the Fastly Service by running:
```shell
fastly log-tail
```

## Adding entries to the KV Store

It is possible to add key-value pairs to an KV Store using the Fastly CLI like so:
```shell
fastly kv-store-entry create --store-id=$FASTLY_KV_STORE_ID --key-name=$KEY --value=$VALUE
```

For example, here is how you could add to the KV Store named `my-store` a key named `readme` whose value is the contents of `README.md`:
```shell
fastly kv-store-entry create --store-id="$(fastly kv-store list --json | jq -r '.Data[]|select(.Name=="my-store").ID')" --key-name="readme" --value="$(cat README.md)"
```

## Security issues

Please see our [SECURITY.md](SECURITY.md) for guidance on reporting security-related issues.
