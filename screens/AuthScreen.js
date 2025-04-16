import { View, Text } from 'react-native'
import React, { use, useState } from 'react'

import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"

const AuthScreen = () => {

  return (
    <View>
      <SignUp />
    </View>
  )
}

export default AuthScreen