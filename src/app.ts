import { ObjectStore } from "fastly:object-store";
import { env } from "fastly:env";

export async function app(event: FetchEvent) {
    // Log out which version of the Fastly Service is responding to this request.
    // This is useful to know when debugging.
    console.log(`FASTLY_SERVICE_VERSION: ${env('FASTLY_SERVICE_VERSION') || 'local'}`);

    /**
        Construct an ObjectStore instance which is connected to the Object Store named `my-store`

        [Documentation for the ObjectStore constuctor can be found here](https://js-compute-reference-docs.edgecompute.app/docs/fastly:object-store/ObjectStore/)
    */
    const store = new ObjectStore('my-store');

    const path = (new URL(event.request.url)).pathname;
    if (path === '/readme') {
        const entry = await store.get('readme');

        if (!entry) {
            return new Response("Not Found", { status: 404 });
        }

        // Stream the value back to the user-agent.
        return new Response(entry.body);
    }

    /**
        Adds or updates the key `hello` in the Object Store with the value `world`.
        
        Note: Object stores are eventually consistent, this means that the updated value associated
        with the key may not be available to read from all edge locations immediately and some edge
        locations may continue returning the previous value associated with the key.

        [Documentation for the put method can be found here](https://js-compute-reference-docs.edgecompute.app/docs/fastly:object-store/ObjectStore/prototype/put)
    */
    await store.put('hello', 'world');

    /**
        Retrieve the value associated with the key `hello` in the Object Store.
        If the key does not exist, then `null` is returned.
        If the key does exist, then an `ObjectStoreEntry` is returned.
        
        `ObjectStoreEntry` is similar to `Response`, both have `text`/`json`/`arrayBuffer` methods and both return a ReadableStream via their `body` property.

        [Documentation for the get method can be found here](https://js-compute-reference-docs.edgecompute.app/docs/fastly:object-store/ObjectStore/prototype/get)
     */
    const entry = await store.get('hello');

    if (!entry) {
        return new Response("Not Found", { status: 404 });
    }

    // Stream the value back to the user-agent.
    return new Response(entry.body);
}
