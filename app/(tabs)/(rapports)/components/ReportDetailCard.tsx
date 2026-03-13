import { useAppTheme } from '@/lib/context/ThemeContext'
import { rapports } from '@/lib/database/schema'
import { Calendar, DollarSign, HelpCircle, User, Users, X } from '@tamagui/lucide-icons'
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

type Report = typeof rapports.$inferSelect

interface ReportDetailCardProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    report: Report | null
}

export const ReportDetailCard = ({ open, onOpenChange, report }: ReportDetailCardProps) => {
    const COLORS = useAppColors()
    const { isDark } = useAppTheme()

    if (!report) return null

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
            snapPoints={[80]}
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
                        <H3 color={COLORS.textPrimary} fontWeight="800">Détails du Rapport</H3>
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
                            <YStack gap="$1" py="$4">
                                <Text fontSize={24} fontWeight="800" color={COLORS.gold}>{report.title}</Text>
                                <Text fontSize={16} color={COLORS.textSecondary}>{report.type}</Text>
                            </YStack>

                            <Separator bc={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} />

                            {/* Details Grid */}
                            <YStack gap="$1" mt="$4">
                                <DetailItem icon={Calendar} label="Date" value={report.date} />
                                <DetailItem icon={User} label="Auteur" value={report.author} />
                                <DetailItem icon={DollarSign} label="Offrande" value={report.offering ? `${report.offering} Ar` : null} />
                                <DetailItem icon={DollarSign} label="Dîme" value={report.dim ? `${report.dim} Ar` : null} />
                                <DetailItem icon={Users} label="Présents" value={report.totalPresent} />
                                <DetailItem icon={Users} label="Nouveaux" value={report.totalNews} />

                                <Separator bc={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} my="$4" />

                                <DetailItem icon={HelpCircle} label="Description" value={report.desc} />
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
