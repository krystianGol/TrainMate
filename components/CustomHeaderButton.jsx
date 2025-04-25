import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { HeaderButton } from 'react-navigation-header-buttons';

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton 
        IconComponent={props.iconPack}
        {...props}
        >
    </HeaderButton>
  )
}

export default CustomHeaderButton