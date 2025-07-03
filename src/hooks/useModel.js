/**
 * useModel — JPEG·PNG·WEBP destekli, softmax’li
 * TAG: USE_MODEL
 */
import { useEffect, useState } from 'react';
import { Platform }             from 'react-native';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import RNFS                    from 'react-native-fs';
import ImageResizer            from 'react-native-image-resizer';
import { Buffer }              from 'buffer';
import { decode as decodeJpeg } from 'jpeg-js';
const UP_INDEX = 0; 
const TAG        = 'USE_MODEL';
const MODEL_NAME = 'model.onnx';
const DEST_PATH  = `${RNFS.DocumentDirectoryPath}/${MODEL_NAME}`;

const SIZE = 224;
const MEAN = [0.485, 0.456, 0.406];
const STD  = [0.229, 0.224, 0.225];

/* ---- JPEG yolu → Tensor ---- */
async function jpegToTensor(path) {
  const b64  = await RNFS.readFile(path, 'base64');
  const jpg  = decodeJpeg(Buffer.from(b64, 'base64'), { useTArray: true });
  const { data } = jpg;

  const float = new Float32Array(3 * SIZE * SIZE);
  for (let p = 0; p < SIZE * SIZE; p++) {
    for (let c = 0; c < 3; c++) {
      float[c * SIZE * SIZE + p] =
        (data[p * 4 + c] / 255 - MEAN[c]) / STD[c];
    }
  }
  return new Tensor('float32', float, [1, 3, SIZE, SIZE]);
}

/* ---- herhangi görsel uri → Tensor ---- */
async function preprocess(uri) {
  /* 1) 224×224 JPEG */
  const { uri: outUri } = await ImageResizer.createResizedImage(
    uri, 224, 224, 'JPEG', 92, 0
  );

  /* 2) Dosya gerçekten 224×224 mi? */
  const stat = await RNFS.stat(outUri);
  if (stat.size < 10_000)       // küçükse yazma bitmemiş demek
    await new Promise(r => setTimeout(r, 30));

  /* 3) JPEG decode */
  const jpgData = await RNFS.readFile(outUri, 'base64');
  const jpeg = decodeJpeg(Buffer.from(jpgData, 'base64'), { useTArray:true });
  if (!jpeg.width || !jpeg.height || !jpeg.data) {
    throw new Error('JPEG decode failed');
  }

  /* … tensor oluşturma aynı … */
}

export default function useModel() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /* — model kopyala & ORT aç — */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!(await RNFS.exists(DEST_PATH))) {
          if (Platform.OS === 'android')
            await RNFS.copyFileAssets(MODEL_NAME, DEST_PATH);
          else
            await RNFS.copyFile(`${RNFS.MainBundlePath}/${MODEL_NAME}`, DEST_PATH);
          console.log(`[${TAG}] model kopyalandı → ${DEST_PATH}`);
        }
        const modelPath =
          Platform.OS === 'android' ? `file://${DEST_PATH}` : DEST_PATH;

        console.log(`[${TAG}] ORT create…`);
        const sess = await InferenceSession.create(modelPath, {
          graphOptimizationLevel: 'all',
        });
        console.log(`[${TAG}] ORT hazır ✅`);
        if (!cancelled) setSession(sess);
      } catch (e) {
        console.error(`[${TAG}] ORT HATA:`, e);
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* — tahmin — */
  const runInference = async (imgUri) => {
    if (!session) throw new Error('Model not ready');
    try {
      const input = await preprocess(imgUri);
      const { logits } = await session.run({ image: input });
      const [l0, l1]   = logits.data;
  
      /* softmax */
      const maxL = Math.max(l0, l1);
      const e0 = Math.exp(l0 - maxL);
      const e1 = Math.exp(l1 - maxL);
      const p0 = e0 / (e0 + e1);
      const p1 = 1 - p0;
  
      /* argmax sınıfı */
      const isUp = (l0 > l1 ? 0 : 1) === UP_INDEX;
  
      console.log(`[${TAG}] logits=[${l0.toFixed(2)}, ${l1.toFixed(2)}]   `
                  + `P=[${p0.toFixed(2)}, ${p1.toFixed(2)}]   `
                  + `→ ${isUp ? 'UP' : 'DOWN'}`);
  
      return { isUp, probUp: p1, probDown: p0 };   // isim fark etmiyor artık
    } catch (e) {
      console.error(`[${TAG}] inference HATA:`, e);
      setError(e);
      throw e;
    }
  };

  return { session, loading, error, runInference };
}
