function fromBase64Unicode(base64: string) {
  if (!base64) return '';
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export { fromBase64Unicode };
