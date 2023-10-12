import { Text, View, Button, SafeAreaView } from 'react-native'
import * as React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthContextType, RootStackParamsList } from '../types/types'
import { useContext } from 'react'
import { AuthContext } from '../../App'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import { AccessToken, LoginManager, LoginButton, Profile } from 'react-native-fbsdk-next'

type Props = NativeStackScreenProps<RootStackParamsList, 'SignIn'>

GoogleSignin.configure({
    webClientId: "936062440164-6gdoqb3j20n3j91ru4hnuc14fk3dco6u.apps.googleusercontent.com"
})

export function SignInComponent({ navigation, route }: Props) {

    const { signIn } = useContext(AuthContext) as AuthContextType

    return (
        <SafeAreaView>
            <Text>Welcome to CrossTalk</Text>
            <Text>Please sign in using:</Text>
            {/* <Button title='Google' onPress={() => onGoogleButtonPress().then((credentials) => signIn(credentials))} /> */}
            <GoogleSigninButton onPress={() => onGoogleButtonPress().then((credentials) => signIn(credentials))} />
            <Text>Or</Text>
            {/* <Button title='Facebook' onPress={() => onFacebookButtonPress().then((credentials) => signIn(credentials))} /> */}
            <LoginButton permissions={['public_profile']} onLoginFinished={
                (error, result) => {
                    console.log("error: ", error, "\nResult: ", result)
                    if (error) {
                        console.log("login has error: " + result);
                    } else if (result.isCancelled) {
                        console.log("login is cancelled.");
                    } else {
                        console.log('Succes')
                        AccessToken.getCurrentAccessToken().then(
                            (data) => {
                                console.log(data)
                                if (data) {
                                    signIn(data.accessToken)
                                }
                            }
                        )
                    }
                }
            } onLogoutFinished={() => console.log("logout.")} />
        </SafeAreaView>
    )
}

async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

    const result = await GoogleSignin.signIn().catch((error) => { throw error })

    const googleCrendential = auth.GoogleAuthProvider.credential(result.idToken)

    return (await auth().signInWithCredential(googleCrendential)).user.getIdToken(true)
}

async function onFacebookButtonPress() {
    LoginManager.logOut()
    const result = await LoginManager.logInWithPermissions(['public_profile'])

    if (result.isCancelled) {
        throw 'User cancelled login'
    }

    const data = await AccessToken.getCurrentAccessToken()
    if (!data) {
        throw 'Something went wrong accessing token'
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken)
    console.log("credential: ", facebookCredential)

    return (await auth().signInWithCredential(facebookCredential)).user.getIdToken()
}