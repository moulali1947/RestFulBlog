export default function arrayBufferToBase64 (buffer) {
  var binary = ''
  var bytes = [].slice.call(new Uint8Array(buffer))

  bytes.forEach(b => (binary += String.fromCharCode(b)))
  var imagepath = binary.split('\\')
  return imagepath[2]
}
