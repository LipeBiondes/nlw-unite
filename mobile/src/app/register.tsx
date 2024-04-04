import { useState, useEffect } from 'react'

import { Alert, Image, StatusBar, View } from 'react-native'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { Link, router } from 'expo-router'

import axios from 'axios'

import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Button } from '@/components/button'

import { colors } from '@/styles/colors'

import { api } from '@/server/api'
import { useBadgeStore } from '@/store/badge-store'

export type EventProps = {
  id: string
  title: string
}

export default function Register() {
  const [events, setEvents] = useState<EventProps[]>([])
  const [eventId, setEventId] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const badgeStore = useBadgeStore()

  async function getEvents() {
    try {
      const response = await api.get('/events/all/')
      setEvents(response.data.events)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          String(error.response?.data.message).includes('internal server error')
        ) {
          return Alert.alert(
            'Eventos',
            'Serviço indisponível. Tente novamente mais tarde.'
          )
        }
      }
      Alert.alert('Eventos', 'Nenhum evento encontrado.')
    }
  }

  useEffect(() => {
    getEvents()
  }, [])

  async function handleRegister() {
    try {
      if (!name.trim() || !email.trim() || !eventId.trim()) {
        return Alert.alert(
          'Inscrição',
          'Preencha todos os campos ou selecione um evento.'
        )
      }

      setIsLoading(true)

      const registerResponse = await api.post(`/events/${eventId}/attendees`, {
        name,
        email
      })

      if (registerResponse.data.attendeeId) {
        const badgeResponse = await api.get(
          `/attendees/${registerResponse.data.attendeeId}/badge`
        )

        badgeStore.save(badgeResponse.data.badge)

        Alert.alert('Inscrição', 'Inscrição realizada com sucesso.', [
          {
            text: 'Ok',
            onPress: () => {
              router.push('/ticket')
            }
          }
        ])
      }
    } catch (error) {
      setIsLoading(false)

      if (axios.isAxiosError(error)) {
        if (
          String(error.response?.data.message).includes(
            'this email is already registered for this event'
          )
        ) {
          return Alert.alert(
            'Inscrição',
            'Este email já está cadastrado neste evento.'
          )
        }
        if (
          String(error.response?.data.message).includes(
            'Error during validation'
          )
        ) {
          return Alert.alert(
            'Validação',
            'Erro ao tentar se cadastrar nesse evento com esse email ou nome.'
          )
        }
        if (
          String(error.response?.data.message).includes(
            'The maximum number of attendees has been reached'
          )
        ) {
          return Alert.alert(
            'Inscrição',
            'Infelizmente o evento atingiu o número máximo de inscrições.'
          )
        }
        if (String(error.response?.data.message).includes('Event not found')) {
          return Alert.alert('Inscrição', 'Evento não encontrado.')
        }
      }
      return Alert.alert('Inscrição', 'Erro ao tentar se inscrever no evento.')
    }
  }

  return (
    <View className="flex-1 bg-green-500 items-center justify-center p-8">
      <StatusBar barStyle="light-content" />
      <Image
        source={require('@/assets/logo.png')}
        className="h-16"
        resizeMode="contain"
      />

      <View className="w-full mt-12 gap-3">
        <Select
          data={events}
          onSelect={eventSelected => setEventId(eventSelected.id)}
        />

        <Input>
          <FontAwesome6
            name="user-circle"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field onChangeText={setName} placeholder="Nome completo" />
        </Input>

        <Input>
          <MaterialIcons
            name="alternate-email"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            onChangeText={setEmail}
            placeholder="Example@gmail.com"
            keyboardType="email-address"
          />
        </Input>

        <Button
          title="Realizar inscrição"
          onPress={handleRegister}
          isLoading={isLoading}
        />
        <Link
          href="/"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Já possui ingresso?
        </Link>
      </View>
    </View>
  )
}
