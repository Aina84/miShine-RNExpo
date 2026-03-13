import { useAppTheme } from '@/lib/context/ThemeContext'
import { finances } from '@/lib/database/schema'
import { ArrowDownCircle, ArrowUpCircle, Calendar, Info, Tag, X } from '@tamagui/lucide-icons'
import React from 'react'
import {
    Button,
    H3,
    ScrollView,
    Separator,
    Sheet,
    Text,
    XStack,
    YStack,
} from 'tamagui'
import { useAppColors } from '../../../utils/styles'

type Finance = typeof finances.$inferSelect

interface FinanceDetailCardProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    finance: Finance | null
}

export const FinanceDetailCard = ({ open, onOpenChange, finance }: FinanceDetailCardProps) => {
    const COLORS = useAppColors()
    const { isDark } = useAppTheme()

    if (!finance) return null

    const DetailItem = ({ icon: Icon, label, value, color = COLORS.textSecondary }: { icon: any, label: string, value: string | number | null | undefined, color?: string }) => (
        <XStack gap="$4" ai="flex-start" py="$3">
            <YStack padding="$2" borderRadius="$3" bg={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}>
                <Icon size={20} color={COLORS.gold} />
            </YStack>
            <YStack f={1}>
                <Text fontSize={12} color={COLORS.textMuted} fontWeight="600" textTransform="uppercase" letterSpacing={1}>
                    {label}
                </Text>
                <Text fontSize={16} color={color} fontWeight="500" mt="$1">
                    {value?.toString() || 'Non renseigné'}
                </Text>
            </YStack>
        </XStack>
    )

    return (
        <Sheet
            modal
            open={open}
            onOpenChange={onOpenChange}
            snapPoints={[70]}
            dismissOnSnapToBottom
        >

            <Sheet.Overlay
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                backgroundColor="rgba(0,0,0,0.8)"
            />

            <Sheet.Frame backgroundColor={COLORS.bg} padding="$4" borderTopLeftRadius="$9" borderTopRightRadius="$9">
                <Sheet.Handle backgroundColor={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} />

                <YStack f={1} gap="$4" pt="$4">
                    <XStack jc="space-between" ai="center">
                        <H3 color={COLORS.textPrimary} fontWeight="800">Détails de la Transaction</H3>
                        <Button
                            size="$3"
                            circular
                            icon={X}
                            onPress={() => onOpenChange(false)}
                            backgroundColor={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                        />
                    </XStack>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <YStack gap="$2" pb="$10">
                            {/* Header Info */}
                            <YStack ai="center" py="$6" gap="$2">
                                <YStack
                                    padding="$4"
                                    borderRadius="$full"
                                    bg={finance.type === 'revenue' ? (isDark ? "rgba(52, 201, 138, 0.1)" : "rgba(52, 201, 138, 0.08)") : (isDark ? "rgba(231, 76, 60, 0.1)" : "rgba(231, 76, 60, 0.08)")}
                                >
                                    <Text fontSize={40}>{finance.icon || (finance.type === 'revenue' ? '💰' : '💸')}</Text>
                                </YStack>
                                <Text fontSize={24} fontWeight="800" color={finance.type === 'revenue' ? COLORS.success : COLORS.accent}>
                                    {finance.type === 'revenue' ? '+' : '-'} {finance.amount?.toLocaleString('fr-FR')} Ar
                                </Text>
                                <Text fontSize={18} fontWeight="600" color={COLORS.textPrimary}>{finance.name}</Text>
                            </YStack>

                            <Separator bc={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} />

                            {/* Details Grid */}
                            <YStack gap="$1" mt="$4">
                                <DetailItem icon={Calendar} label="Date" value={finance.date} />
                                <DetailItem icon={Tag} label="Catégorie" value={finance.category} />
                                <DetailItem
                                    icon={finance.type === 'revenue' ? ArrowUpCircle : ArrowDownCircle}
                                    label="Type"
                                    value={finance.type === 'revenue' ? 'Revenu' : 'Dépense'}
                                    color={finance.type === 'revenue' ? COLORS.success : COLORS.accent}
                                />

                                <Separator bc={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} my="$4" />

                                <DetailItem icon={Info} label="ID Transaction" value={`#TRX-${finance.id}`} />
                            </YStack>

                            <YStack mt="$6">
                                <Button
                                    backgroundColor={COLORS.gold}
                                    onPress={() => onOpenChange(false)}
                                >
                                    <Text color={isDark ? "black" : "white"} fontWeight="800">FERMER</Text>
                                </Button>

                            </YStack>
                        </YStack>
                    </ScrollView>
                </YStack>
            </Sheet.Frame>
        </Sheet>
    )
}
