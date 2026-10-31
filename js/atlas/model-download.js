/**
 * Decodifica respostas binárias de modelos 3D com descompressão inteligente.
 * Servidores estáticos como GitHub Pages podem servir arquivos .bin.gz brutos
 * sem cabeçalho Content-Encoding; este utilitário detecta os magic bytes do GZIP
 * e descomprime transparentemente usando a Web Streams API (DecompressionStream).
 */
export async function decodeModelResponse(response, expectedBytes, compressed) {
  if (!response.ok) {
    throw new Error(`Falha ao carregar arquivo de geometria: status ${response.status}`);
  }

  const payload = await response.arrayBuffer();
  const signature = new Uint8Array(payload, 0, Math.min(2, payload.byteLength));
  const isGzip = compressed && signature[0] === 0x1f && signature[1] === 0x8b;

  let buffer;
  if (isGzip) {
    if (typeof DecompressionStream !== 'undefined') {
      const stream = new Blob([payload]).stream().pipeThrough(new DecompressionStream('gzip'));
      buffer = await new Response(stream).arrayBuffer();
    } else {
      throw new Error('Seu navegador não suporta DecompressionStream para descompactar o modelo.');
    }
  } else {
    buffer = payload;
  }

  if (expectedBytes && buffer.byteLength !== expectedBytes) {
    console.warn(`Tamanho divergente: esperado ${expectedBytes}, recebido ${buffer.byteLength}`);
  }

  return buffer;
}
