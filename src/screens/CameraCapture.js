// src/screens/CameraCapture.js
import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import ButtonIcon       from '../components/ButtonIcon';
import { Colors,Layout }       from '../theme';

export default function CameraCapture({ navigation }) {
  const [uri, setUri] = useState(null);

  const openCam = () =>
    launchCamera({ mediaType:'photo', saveToPhotos:true }, r => {
      if (r.didCancel || r.errorCode) return;
      setUri(r.assets[0].uri);
    });

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: Colors.surface }]}
    >
      <ButtonIcon icon="camera" txt="Fotoğraf Çek" onPress={openCam} />
      {uri && <Image source={{ uri }} style={styles.img} />}
      {uri && (
        <ButtonIcon
        name="check"
        iconStyle="solid"
        primary
        onPress={() => navigation.navigate('Home', { image: uri })}
      />
      )}
      {!uri && <Text style={styles.hint}>Lütfen önce bir fotoğraf çekin.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow:       1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        24,
  },
  img: {
    width:        320,
    height:       220,
    marginTop:    16,
    borderRadius: 8,
  },
  hint: {
    marginTop:    20,
    color:        Colors.textLight,
    fontStyle:    'italic',
  },
});
