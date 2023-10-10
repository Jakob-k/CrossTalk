import { Text, View, Button, SafeAreaView } from 'react-native'
import * as React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamsList } from '../types/types'
import { useContext } from 'react'
import { AuthContext } from '../../App'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import { AccessToken, LoginManager, LoginButton } from 'react-native-fbsdk-next'

type Props = NativeStackScreenProps<RootStackParamsList, 'SignIn'>

GoogleSignin.configure({
    webClientId: "936062440164-6gdoqb3j20n3j91ru4hnuc14fk3dco6u.apps.googleusercontent.com"
})

export function SignInComponent({ navigation, route }: Props) {

    const { signIn } = useContext(AuthContext)

    return (
        <SafeAreaView>
            <Text>Welcome to CrossTalk</Text>
            <Text>Please sign in using:</Text>
            <Button title='Google' onPress={() => onGoogleButtonPress().then((credentials) => signIn(credentials))} />
            <Text>Or</Text>
            <Button title='Facebook' onPress={() => onFacebookButtonPress().then((credentials) => signIn(credentials))} />
        </SafeAreaView>
    )
}

async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

    const result = await GoogleSignin.signIn().catch((error) => { throw error })

    const googleCrendential = auth.GoogleAuthProvider.credential(result.idToken)

    return auth().signInWithCredential(googleCrendential)
}

async function onFacebookButtonPress() {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])

    if (result.isCancelled) {
        throw 'User cancelled login'
    }

    const data = await AccessToken.getCurrentAccessToken()
    if (!data) {
        throw 'Something went wrong accessing token'
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken)

    return auth().signInWithCredential(facebookCredential)
}