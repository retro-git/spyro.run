import crc32 from 'crc/crc32';

onmessage = function(e) {
    const checksum = crc32(new Uint8Array(e.data.file)).toString(16);
    postMessage({
        type: "checksum_complete",
        checksum: checksum,
    });
}