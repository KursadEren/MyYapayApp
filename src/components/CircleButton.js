import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Colors,Layout } from '../theme';

export default function CircleButton({
  name,
  iconStyle = 'regular',
  onPress,
  disabled,
  primary,
}) {
  const bg     = primary ? Colors.accent : 'transparent';
  const border = primary ? Colors.accent : Colors.border;
  const color  = primary ? Colors.surface : Colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          borderColor:     border,
          opacity:         disabled ? 0.5 : 1,
        },
      ]}
    >
      <FontAwesome6
        name={name}
        size={24}
        color={color}
        iconStyle={iconStyle}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width:          60,
    height:         60,
    borderRadius:   30,
    borderWidth:    1,
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    12,
  },
});
