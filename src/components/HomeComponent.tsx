import { View, Text, Button } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../../App'

export function HomeComponent() {

    const { signOut } = useContext(AuthContext)

    return (
        <View>
            <Text>Choose a chat room</Text>
            <Button title='Sign Out' onPress={() => signOut()} />
        </View>
    )
}