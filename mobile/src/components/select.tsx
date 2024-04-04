import { Text, View } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'

import { colors } from '@/styles/colors'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

export type ItemProps = {
  id: string
  title: string
}

type Props = {
  data: ItemProps[]
  onSelect: (selectedItem: ItemProps) => void
}

export function Select({ data, onSelect }: Props) {
  return (
    <SelectDropdown
      data={data}
      onSelect={selectedItem => onSelect(selectedItem)}
      renderButton={selectedItem => {
        return (
          <View className="w-full h-14 flex-row items-start gap-3 p-3 border border-green-400 rounded-lg">
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color={colors.green[200]}
            />
            <Text className="flex-1 text-gray-200 text-base font-regular ">
              {(selectedItem && selectedItem.title) || 'Select your event'}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color={colors.gray[300]}
            />
          </View>
        )
      }}
      renderItem={(item, _, isSelected) => {
        return (
          <View className="w-full p-4 bg-green-500 flex-row items-center gap-3">
            <Text className="flex-1 text-base font-regular color-white">
              {item.title}
            </Text>
            <FontAwesome
              name="chevron-left"
              size={20}
              color={colors.white}
              style={{
                ...(isSelected && { color: colors.orange[500] })
              }}
            />
          </View>
        )
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}
