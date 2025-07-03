// src/screens/Downloads.js
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import Card from '../components/Card';
import Icon from '@react-native-vector-icons/fontawesome6';
import { Colors, Layout } from '../theme';

export default function Downloads({ navigation }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // —— Android Runtime İzni —— 
        if (Platform.OS === 'android') {
          // API 33+ için READ_MEDIA_IMAGES
          const perm =
            Platform.Version >= 33
              ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
              : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

          const granted = await PermissionsAndroid.request(perm, {
            title: 'Depolama İzni',
            message: 'Resimleri listeleyebilmek için depolama izni gerekiyor.',
            buttonPositive: 'Tamam',
            buttonNegative: 'İptal',
          });

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'İzin Reddedildi',
              'Depolama erişimi olmadan resim listelenemez.'
            );
            return;
          }
        }

        // —— Dizin Yolu —— 
        const dirPath =
          Platform.OS === 'android'
            ? RNFS.DownloadDirectoryPath
            : RNFS.DocumentDirectoryPath;

        // —— Dosyaları Oku —— 
        const list = await RNFS.readDir(dirPath);
        const imgs = list.filter(f => /\.(jpe?g|png)$/i.test(f.name));
        setFiles(imgs);
      } catch (e) {
        Alert.alert('Okuma Hatası', e.message);
      }
    })();
  }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      {files.map(f => (
        <Card key={f.path} style={styles.fileCard}>
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.navigate('Home', {
                image: Platform.OS === 'android'
                  ? `file://${f.path}`
                  : f.path
              })
            }
          >
            <Icon
              name="file-image"
              size={20}
              iconStyle="regular"
              color={Colors.primary}
            />
            <Text style={styles.txt}>{f.name}</Text>
          </TouchableOpacity>
        </Card>
      ))}

      {!files.length && (
        <Text style={styles.empty}>
          İzin verilmişse & Download klasörüne fotoğraf yükleyin.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:     { flex:1, backgroundColor: Colors.background },
  scroll:   { padding: Layout.padding },
  fileCard: { padding: 0, marginVertical: 6 },
  row:      {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       12,
  },
  txt:      {
    marginLeft:  12,
    color:       Colors.text,
    fontSize:    15,
  },
  empty:    {
    marginTop:   Layout.margin,
    textAlign:   'center',
    color:       Colors.textLight,
  },
});
