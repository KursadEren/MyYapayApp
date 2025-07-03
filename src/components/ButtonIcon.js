// src/components/ButtonIcon.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { Colors ,Layout} from '../theme';

export default function ButtonIcon({ icon, txt, onPress, green }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        green && { backgroundColor: Colors.accent }
      ]}
    >
      <Icon name={icon} size={18} color="#fff" iconStyle="solid" />
      <Text style={styles.txt}>{txt}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:        12,
    borderRadius:   8,
    backgroundColor: Colors.primary,
    marginVertical:  6,
  },
  txt: {
    color:     '#fff',
    marginLeft: 8,
    fontSize:  15,
  },
});
