import { Text, View } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'

import { colors } from '@/styles/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
              color={colors.gray[200]}
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
          <View
            className="w-full p-4 bg-zinc-900"
            style={{
              ...(isSelected && { backgroundColor: colors.green[500] })
            }}
          >
            <Text className="flex-1 text-base font-regular color-gray-300">
              {item.title}
            </Text>
          </View>
        )
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}
