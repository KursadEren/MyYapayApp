// src/screens/Home.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import Card          from '../components/Card';
import CircleButton  from '../components/CircleButton';
import FontAwesome6  from '@react-native-vector-icons/fontawesome6';
import { Colors }    from '../theme';
import useModel      from '../hooks/useModel';

export default function Home({ route, navigation }) {
  const isDark = useColorScheme() === 'dark';
  const { session, isLoading, runInference } = useModel();

  const [imgUri, setImgUri]         = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const uri = route.params?.image;
    if (!uri || !session) return;
    setImgUri(uri);
    setPrediction(null);
    (async () => {
      const score = await runInference(uri);
      // score ∈ [0,1],  ≥ 0.5 → UP, < 0.5 → DOWN
      setPrediction(score != null ? score >= 0.5 : null);
    })();
  }, [route.params?.image, session]);
  useEffect(() => {
    if (session && imgUri) {
      runInference(imgUri).then(score => {
        setPrediction(score >= 0.5 ? 'UP' : 'DOWN');
      });
    }
  }, [session, imgUri]);
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Başlık */}
        <Card>
          <Text style={[styles.title, { color: Colors.text }]}>
            <FontAwesome6
              name="bolt-lightning"
              size={22}
              color={Colors.primary}
              iconStyle="solid"
            />{' '}
            Next-Day Direction
          </Text>
        </Card>

        {/* Aksiyon Butonları */}
        <Card style={styles.rowCard}>
          <CircleButton
            name="image"
            iconStyle="regular"
            onPress={() => navigation.navigate('Downloads')}
          />
          <CircleButton
            name="camera"
            iconStyle="solid"
            onPress={() => navigation.navigate('Camera')}
          />
        </Card>

        {/* Görsel Kartı */}
        <Card style={styles.mediaCard}>
          {imgUri ? (
            <Image source={{ uri: imgUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>
              Select an image to predict
            </Text>
          )}
        </Card>

        {/* Tahmin Sonucu Kartı */}
        {imgUri && (
          <Card
            style={[
              styles.resultCard,
              {
                backgroundColor:
                  prediction === null
                    ? Colors.background
                    : prediction
                    ? '#d1fae5'
                    : '#fee2e2',
              },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : prediction === null ? (
              <Text style={styles.resultText}>
                {session ? 'Waiting for model…' : 'Model yükleniyor…'}
              </Text>
            ) : (
              <>
                <Text style={styles.percent}>
                  {prediction ? '📈 UP' : '📉 DOWN'}
                </Text>
                <Text style={styles.result}>
                  {prediction
                    ? 'Artacak, Alış Yapabilirsiniz'
                    : 'Azalacak, Satış Yapabilirsiniz'}
                </Text>
              </>
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:            { flex: 1, backgroundColor: Colors.background },
  scroll:          { padding: 16, paddingBottom: 40 },
  title:           { fontSize: 20, fontWeight: '600' },
  rowCard:         { flexDirection: 'row', justifyContent: 'center' },
  mediaCard:       { alignItems: 'center', justifyContent: 'center', height: 200 },
  image:           { width: '100%', height: '100%', borderRadius: 8 },
  placeholderText: { color: Colors.textLight, fontStyle: 'italic' },
  resultCard:      { marginTop: 16, alignItems: 'center', padding: 16 },
  percent:         { fontSize: 32, fontWeight: '700', color: Colors.text },
  result:          { fontSize: 16, marginTop: 4, textAlign: 'center', color: Colors.textLight },
  resultText:      { fontSize: 16, color: Colors.textLight },
});
