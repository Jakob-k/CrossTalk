import { View, Text, Button } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../../App'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContextType } from '../types/types'

export function HomeComponent() {

    const { signOut } = useContext(AuthContext) as AuthContextType

    return (
        <SafeAreaView>
            <Text>Choose a chat room</Text>
            <Button title='Sign Out' onPress={() => signOut()} />
        </SafeAreaView>
    )
}