// Convert ArrayBuffer/Uint8Array to base64
function toBase64(arrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}

// Convert base64 back to Uint8Array
function fromBase64(base64) {
  return new Uint8Array(
    atob(base64)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
}

async function getKeyFromConvoId(convoId) {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(convoId)
  );
  return crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(msg, convoId) {
  const key = await getKeyFromConvoId(convoId);
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const encoder = new TextEncoder();
  const data = encoder.encode(msg);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    data
  );

  return `${toBase64(iv)}:${toBase64(encryptedBuffer)}`;
}

export async function decryptMessage(encryptedStr, convoId) {
  // console.log("encryptedStr", encryptedStr);
  const [ivB64, contentB64] = encryptedStr.split(":");
  if (!ivB64 || !contentB64) throw new Error("Invalid encrypted format");

  const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
  const content = Uint8Array.from(atob(contentB64), (c) => c.charCodeAt(0));

  const key = await getKeyFromConvoId(convoId);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    content
  );

  return new TextDecoder().decode(decrypted);
}
