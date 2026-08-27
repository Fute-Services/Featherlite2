/// <reference lib="webworker" />

/**
 * Fetches a panorama and decodes it to a right-sized ImageBitmap, off the main
 * thread.
 *
 * Doing this on the main thread - even with createImageBitmap, which is
 * supposed to be asynchronous - measurably stalls it: a 12000x6000 JPEG costs
 * about 190 ms of blocked main thread in Chrome, which is a visible hitch every
 * time a scene changes or a neighbour is preloaded. In here it costs the page
 * nothing, and only the GPU upload is left on the main thread.
 *
 * The bitmap is transferred, not copied, so nothing is duplicated on the way
 * back.
 */

export interface DecodeRequest {
  id: number
  url: string
  /** Target width; height is half of it, as equirectangular images are 2:1. */
  width: number
}

export interface DecodeResponse {
  id: number
  bitmap?: ImageBitmap
  error?: string
}

const ctx = self as unknown as DedicatedWorkerGlobalScope

ctx.onmessage = async (event: MessageEvent<DecodeRequest>) => {
  const { id, url, width } = event.data
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${url}: ${response.status}`)
    const blob = await response.blob()

    let bitmap: ImageBitmap
    try {
      bitmap = await createImageBitmap(blob, {
        resizeWidth: width,
        resizeHeight: width / 2,
        resizeQuality: 'medium',
        // WebGL ignores UNPACK_FLIP_Y for ImageBitmap sources, so the flip has
        // to happen here or the panorama renders upside down.
        imageOrientation: 'flipY',
      })
    } catch {
      // Older browsers reject the resize options; full size still beats no
      // panorama at all.
      bitmap = await createImageBitmap(blob, { imageOrientation: 'flipY' })
    }

    ctx.postMessage({ id, bitmap } satisfies DecodeResponse, [bitmap])
  } catch (error) {
    ctx.postMessage({ id, error: String(error) } satisfies DecodeResponse)
  }
}
