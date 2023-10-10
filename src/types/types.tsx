export type RootStackParamsList = {
    Home: {
        user: {
            email: string,
            name: string,
            rooms: Room[]
        },
        allRooms: Room[]
    },
    SignIn: {
        setUserToken: Function
    }
}

export type Room = {
    lastMessage: string,
    name: string,
    users: User[]
}

export type User = {
    name: string,
    email: string,
    online: boolean,
    lastOnline: Date
}

export type Message = {
    room: Room,
    content: string,
    user: User
}