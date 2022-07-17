const vcdiffPlugin = require('@ably/vcdiff-decoder');

onmessage = function(e) {
    const patched_file = vcdiffPlugin.decode(new Uint8Array(e.data.patch), new Uint8Array(e.data.file));
    postMessage({
        type: "patch_complete",
        patched_file: patched_file,
    });
}