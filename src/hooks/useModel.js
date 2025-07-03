// src/hooks/useModel.js
import { useEffect, useState } from 'react';
import { InferenceSession }    from 'onnxruntime-react-native';
import RNFS                    from 'react-native-fs';

export default function useModel() {
  const [session, setSession]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [assetsList, setAssets] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // 1) Android assets klasörünü (kök) listele
        const files = await RNFS.readDirAssets(''); 
        const names = files.map(f => f.name);
        console.log('🔍 Android assets:', names);
        setAssets(names);

        // 2) ONNX modelini yükle
        const sess = await InferenceSession.create(
          'file:///android_asset/model_quant.onnx'
        );
        
        console.log('✅ ONNX session oluşturuldu');
        setSession(sess);
      } catch (e) {
        console.error('❌ Model yüklenemedi:', e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { session, loading, error, assetsList };
}
