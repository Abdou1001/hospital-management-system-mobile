import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/store/auth.store'
import CardAppointments from './CardAppointments'
import LoginMessage from './LoginMessage'

const ShowAppointments = () => {
    const {user} = useAuthStore()
  return (
    <View>
        {user ? <CardAppointments /> : <LoginMessage />}
    </View>
  )
}

export default ShowAppointments