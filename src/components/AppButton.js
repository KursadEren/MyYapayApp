// src/components/AppButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { Colors ,Layout} from '../theme';

export default function AppButton({ icon, text, onPress, scheme = 'primary' }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        scheme === 'success' && { backgroundColor: Colors.accent }
      ]}
    >
      <Icon name={icon} size={18} color="#fff" iconStyle="solid" />
      <Text style={styles.txt}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection:   'row',
    backgroundColor: Colors.primary,
    marginVertical:  6,
    padding:         14,
    borderRadius:    10,
    justifyContent:  'center',
    alignItems:      'center',
  },
  txt: {
    color:      '#fff',
    marginLeft: 10,
    fontSize:   16,
  },
});
