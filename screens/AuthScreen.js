import { View, Text } from 'react-native'
import React, { use, useState } from 'react'

import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"

const AuthScreen = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <View>
      {isLoggedIn && S}
    </View>
  )
}

export default AuthScreen