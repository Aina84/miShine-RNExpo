import { useAppTheme } from '@/lib/context/ThemeContext'
import { sheeps } from '@/lib/database/schema'
import { Briefcase, Calendar, Info, MapPin, Phone, User, X } from '@tamagui/lucide-icons'
import React from 'react'
import {
    Button,
    H3,
    ScrollView,
    Separator,
    Sheet,
    Text,
    XStack,
    YStack
} from 'tamagui'
import { useAppColors } from '../../../utils/styles'

type Member = typeof sheeps.$inferSelect

interface MemberDetailCardProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    member: Member | null
}

export const MemberDetailCard = ({ open, onOpenChange, member }: MemberDetailCardProps) => {
    const COLORS = useAppColors()
    const { isDark } = useAppTheme()

    if (!member) return null

    const formatDate = (date: Date | null) => {
        if (!date) return 'Non spécifiée'
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const DetailItem = ({ icon: Icon, label, value, color = COLORS.textSecondary }: { icon: any, label: string, value: string | null | undefined, color?: string }) => (
        <XStack gap="$4" ai="flex-start" py="$3">
            <YStack padding="$2" borderRadius="$3" bg={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}>
                <Icon size={20} color={COLORS.gold} />
            </YStack>
            <YStack f={1}>
                <Text fontSize={12} color={COLORS.textMuted} fontWeight="600" textTransform="uppercase" letterSpacing={1}>
                    {label}
                </Text>
                <Text fontSize={16} color={color} fontWeight="500" mt="$1">
                    {value || 'Non renseigné'}
                </Text>
            </YStack>
        </XStack>
    )

    return (
        <Sheet
            modal
            open={open}
            onOpenChange={onOpenChange}
            snapPoints={[85]}
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
                        <H3 color={COLORS.textPrimary} fontWeight="800">Détails du Membre</H3>
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
                            <YStack ai="center" py="$6" gap="$3">
                                <YStack
                                    width={100}
                                    height={100}
                                    borderRadius={50}
                                    bg={member.sexe === 'homme' ? "rgba(52, 152, 219, 0.2)" : "rgba(233, 30, 99, 0.2)"}
                                    ai="center"
                                    jc="center"
                                    bw={2}
                                    bc={member.sexe === 'homme' ? "rgba(52, 152, 219, 0.5)" : "rgba(233, 30, 99, 0.5)"}
                                >
                                    <Text fontSize={40}>{member.sexe === 'homme' ? '👨' : '👩'}</Text>
                                </YStack>
                                <YStack ai="center">
                                    <Text fontSize={24} fontWeight="800" color={COLORS.textPrimary}>{member.name}</Text>
                                    <Text fontSize={14} color={COLORS.gold} fontWeight="600">{member.role || 'Membre'}</Text>
                                </YStack>
                            </YStack>

                            <Separator bc={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} />

                            {/* Details Grid */}
                            <YStack gap="$1" mt="$4">
                                <DetailItem icon={Phone} label="Contact" value={member.contact} />
                                <DetailItem icon={MapPin} label="Adresse" value={member.adress} />
                                <DetailItem icon={User} label="Genre" value={member.sexe === 'homme' ? 'Masculin' : 'Féminin'} />
                                <DetailItem icon={Briefcase} label="Statut" value={member.status} />
                                <DetailItem icon={Calendar} label="Date d'inscription" value={formatDate(member.createdAt)} />

                                <Separator bc={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} my="$4" />

                                <DetailItem icon={Info} label="Description / Notes" value={member.description} />
                            </YStack>

                            <YStack mt="$6" gap="$3">
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
