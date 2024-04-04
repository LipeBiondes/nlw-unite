import { useState } from 'react'

import {
  StatusBar,
  Text,
  View,
  Share,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native'

import { MotiView } from 'moti'

import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Redirect } from 'expo-router'

import { useBadgeStore } from '@/store/badge-store'

import { colors } from '@/styles/colors'

import { Header } from '@/components/header'
import { Credencial } from '@/components/credential'
import { Button } from '@/components/button'
import { QRCodeSvg } from '@/components/qrcode'

export default function Ticket() {
  const [showQRCode, setShowQRCode] = useState<boolean>(false)

  const badgeStore = useBadgeStore()

  async function handleShare() {
    try {
      if (badgeStore.data?.checkInURL) {
        await Share.share({
          message: `Estou participando do evento ${badgeStore.data.eventTitle} e já fiz o check-in. Acesse minha credencial: ${badgeStore.data.checkInURL}`
        })
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Compartilhar', 'Não foi possível compartilhar a credencial')
    }
  }

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4]
      })

      if (result.assets) {
        badgeStore.updateAvatar(result.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Foto', 'Não foi possível selecionar a imagem')
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="Minha Credencial" />

      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credencial
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage}
          onShowQRCode={() => {
            setShowQRCode(true)
          }}
        />

        <MotiView
          from={{
            translateY: 0
          }}
          animate={{
            translateY: 10
          }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 700
          }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar credencial
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostra ao mundo que você vai participar do{' '}
          {badgeStore.data.eventTitle}
        </Text>
        <Button title="Compartilhar" onPress={handleShare} />
        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-10"
          onPress={() => badgeStore.remove()}
        >
          <Text className="text-base text-white font-bold text-center">
            Remover Ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showQRCode} statusBarTranslucent animationType="fade">
        <View className="flex-1 bg-green-500 items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowQRCode(false)}
          >
            <QRCodeSvg value="teste" size={240} />
            <Text className="text-base text-orange-400 font-bold text-center mt-10">
              Fechar QRCode
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
