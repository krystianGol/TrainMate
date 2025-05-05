import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

import colors from '../constans/colors'

const PageContainer = props => {
  return (
    <View style={{...styles.container, ...props.style}}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: colors.backgroundColor,
  }
})

export default PageContainer