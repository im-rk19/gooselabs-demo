/* Minimal ZIP writer (stored, no compression). Works offline, no libraries. */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.MINIZIP = api;
})(this, function () {
  var TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(buf) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < buf.length; i++) c = TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function bytes(str) { return new TextEncoder().encode(str); }
  function push32(a, v) { a.push(v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255); }
  function push16(a, v) { a.push(v & 255, (v >>> 8) & 255); }

  /* files: [{ name: 'index.html', data: Uint8Array | string }] */
  function make(files) {
    var out = [], central = [], offset = 0;
    files.forEach(function (f) {
      var data = typeof f.data === 'string' ? bytes(f.data) : f.data;
      var name = bytes(f.name);
      var crc = crc32(data);
      var local = [];
      push32(local, 0x04034b50); push16(local, 20); push16(local, 0); push16(local, 0);
      push16(local, 0); push16(local, 0);
      push32(local, crc); push32(local, data.length); push32(local, data.length);
      push16(local, name.length); push16(local, 0);
      out.push(new Uint8Array(local), name, data);

      var cen = [];
      push32(cen, 0x02014b50); push16(cen, 20); push16(cen, 20); push16(cen, 0); push16(cen, 0);
      push16(cen, 0); push16(cen, 0);
      push32(cen, crc); push32(cen, data.length); push32(cen, data.length);
      push16(cen, name.length); push16(cen, 0); push16(cen, 0); push16(cen, 0); push16(cen, 0);
      push32(cen, 0); push32(cen, offset);
      central.push(new Uint8Array(cen), name);
      offset += local.length + name.length + data.length;
    });

    var centralSize = central.reduce(function (n, c) { return n + c.length; }, 0);
    var end = [];
    push32(end, 0x06054b50); push16(end, 0); push16(end, 0);
    push16(end, files.length); push16(end, files.length);
    push32(end, centralSize); push32(end, offset); push16(end, 0);
    var parts = out.concat(central, [new Uint8Array(end)]);
    var total = parts.reduce(function (n, p) { return n + p.length; }, 0);
    var buf = new Uint8Array(total), pos = 0;
    parts.forEach(function (p) { buf.set(p, pos); pos += p.length; });
    return new Blob([buf], { type: 'application/zip' });
  }
  return { make: make, crc32: crc32 };
});
