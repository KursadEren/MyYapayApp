import React, { useEffect, useState } from 'react';
import {
  ScrollView, TouchableOpacity, Text, StyleSheet, Alert,
  Platform, PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import Icon from '@react-native-vector-icons/fontawesome6';
import Card from '../components/Card';
import { Colors, Layout } from '../theme';

export default function Downloads({ navigation }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    (async () => {
      /* — izin — */
      if (Platform.OS === 'android') {
        const perm = Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        const ok = await PermissionsAndroid.request(perm);
        if (ok !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('İzin Reddedildi', 'Downloads dizinine erişilemedi.');
          return;
        }
      }

      /* — yol — */
      const dir = Platform.OS === 'android'
        ? `${RNFS.ExternalStorageDirectoryPath}/Download`
        : RNFS.DocumentDirectoryPath;

      /* — dosyalar — */
      const list = await RNFS.readDir(dir);
      const imgs = list.filter(f => /\.(jpe?g|png|webp)$/i.test(f.name));
      setFiles(imgs);
    })().catch(e => Alert.alert('Okuma Hatası', e.message));
  }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      {files.map(f => (
        <Card key={f.path} style={styles.fileCard}>
          <TouchableOpacity style={styles.row}
            onPress={() => navigation.navigate('Home', {
              image: Platform.OS === 'android' ? `file://${f.path}` : f.path
            })}>
            <Icon name="file-image" size={20} iconStyle="regular"
                  color={Colors.primary}/>
            <Text style={styles.txt}>{f.name}</Text>
          </TouchableOpacity>
        </Card>
      ))}

      {!files.length && (
        <Text style={styles.empty}>
          Downloads klasöründe JPEG/PNG/WEBP görsel bulunamadı.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:{ flex:1, backgroundColor:Colors.background },
  scroll:{ padding:Layout.padding },
  fileCard:{ padding:0, marginVertical:6 },
  row:{ flexDirection:'row', alignItems:'center', padding:12 },
  txt:{ marginLeft:12, color:Colors.text, fontSize:15 },
  empty:{ marginTop:Layout.margin, textAlign:'center', color:Colors.textLight },
});
