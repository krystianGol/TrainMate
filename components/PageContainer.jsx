import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

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
    backgroundColor: 'white',
  }
})

export default PageContainer