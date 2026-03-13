import { db } from '@/lib/database/db'
import { finances } from '@/lib/database/schema'
import { activityService } from '@/lib/services/activityService'

import { Check, ChevronDown, ChevronUp, X } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import {
    Adapt,
    Button,
    H4,
    Input,
    Label,
    PortalProvider,
    ScrollView,
    Select,
    Separator,
    Sheet,
    Text,
    XStack,
    YStack,
} from 'tamagui'

type FinanceForm = {
    name: string
    amount: string
    category: string
    date: string
}

const CATEGORIES = ['Dîme', 'Offrande', 'Don', 'Dépense']

type AddFinanceCardProps = {
    visible: boolean
    onClose: () => void
    onFinanceAdded?: () => void
}

export function AddFinanceCard({ visible, onClose, onFinanceAdded }: AddFinanceCardProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState<FinanceForm>({
        name: '',
        amount: '',
        category: '',
        date: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    })
    const [errors, setErrors] = useState<Partial<FinanceForm>>({})

    const validate = () => {
        const newErrors: Partial<FinanceForm> = {}
        if (!form.name.trim()) newErrors.name = 'Le motif est requis'
        if (!form.amount.trim() || isNaN(Number(form.amount))) newErrors.amount = 'Un montant valide est requis'
        if (!form.category.trim()) newErrors.category = 'La catégorie est requise'
        if (!form.date.trim()) newErrors.date = 'La date est requise'
        if (!(/^\d{1,2}\s(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s\d{4}$/i).test(form.date)) newErrors.date = 'La date entrer n\'est pas valide : dd mm aaaa'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const resetForm = () => {
        setForm({
            name: '',
            amount: '',
            category: '',
            date: new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        })
        setErrors({})
    }

    const handleSubmit = async () => {
        if (!validate()) return

        setIsSubmitting(true)
        try {
            let type = 'income'
            let icon = '🙏'
            if (form.category === 'Dépense') {
                type = 'expense'
                icon = '💸'
            } else if (form.category === 'Dîme') {
                type = 'income'
                icon = '💚'
            } else if (form.category === 'Don') {
                type = 'income'
                icon = '🎁'
            }

            await db.insert(finances).values({
                type: type,
                category: form.category,
                name: form.name,
                amount: parseInt(form.amount, 10),
                date: form.date,
                icon: icon,
            })

            // Log activity
            await activityService.logActivity(icon, `${form.category} : ${form.name} (${form.amount} Ar)`);


            console.log('Succès ! La transaction a été ajoutée avec succès')

            resetForm()
            onClose()
            onFinanceAdded?.()
        } catch (error) {
            console.log("Erreur : Impossible d'ajouter la transaction")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        resetForm()
        onClose()
    }

    const setField = (field: keyof FinanceForm) => (value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    return (
        <PortalProvider shouldAddRootHost>
            <Sheet
                modal
                open={visible}
                onOpenChange={(open: boolean) => { if (!open) handleCancel() }}
                snapPoints={[85]}
                dismissOnSnapToBottom
                dismissOnOverlayPress
                zIndex={100000}
            >
                <Sheet.Overlay
                    backgroundColor="rgba(0,0,0,0.5)"
                />
                <Sheet.Handle />
                <Sheet.Frame
                    padding="$10"
                    backgroundColor="$backgroundStrong"
                    borderTopLeftRadius="$6"
                    borderTopRightRadius="$6"
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <YStack gap="$4">
                            <XStack justifyContent="space-between" alignItems="center">
                                <YStack>
                                    <H4 color="$color" fontWeight="700">
                                        ➕ Nouvelle Transaction
                                    </H4>
                                    <Text color="$gray10" fontSize="$3" marginTop="$1">
                                        Ajoutez une dîme, offrande ou dépense
                                    </Text>
                                </YStack>
                                <Button
                                    size="$3"
                                    circular
                                    onPress={handleCancel}
                                    backgroundColor="transparent"
                                    pressStyle={{ opacity: 0.5 }}
                                    icon={<X size={16} />}
                                />
                            </XStack>

                            <Separator />

                            {/* Formulaire */}
                            <YStack gap="$3">
                                {/* Motif */}
                                <YStack gap="$1">
                                    <Label htmlFor="name" color="$color" fontSize="$3" fontWeight="600">
                                        Motif <Text color="$red10">*</Text>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Dîme de janvier"
                                        value={form.name}
                                        onChangeText={setField('name')}
                                        borderColor={errors.name ? '$red8' : '$borderColor'}
                                        focusStyle={{ borderColor: '$blue8' }}
                                        size="$4"
                                        disabled={isSubmitting}
                                    />
                                    {errors.name && (
                                        <Text color="$red10" fontSize="$2">{errors.name}</Text>
                                    )}
                                </YStack>

                                {/* Montant */}
                                <YStack gap="$1">
                                    <Label htmlFor="amount" color="$color" fontSize="$3" fontWeight="600">
                                        Montant (Ar) <Text color="$red10">*</Text>
                                    </Label>
                                    <Input
                                        id="amount"
                                        placeholder="Ex: 50000"
                                        value={form.amount}
                                        onChangeText={setField('amount')}
                                        keyboardType="numeric"
                                        borderColor={errors.amount ? '$red8' : '$borderColor'}
                                        focusStyle={{ borderColor: '$blue8' }}
                                        size="$4"
                                        disabled={isSubmitting}
                                    />
                                    {errors.amount && (
                                        <Text color="$red10" fontSize="$2">{errors.amount}</Text>
                                    )}
                                </YStack>

                                {/* Date */}
                                <YStack gap="$1">
                                    <Label htmlFor="date" color="$color" fontSize="$3" fontWeight="600">
                                        Date <Text color="$red10">*</Text>
                                    </Label>
                                    <Input
                                        id="date"
                                        placeholder="Ex: 15 juin 2026"
                                        value={form.date}
                                        onChangeText={setField('date')}
                                        borderColor={errors.date ? '$red8' : '$borderColor'}
                                        focusStyle={{ borderColor: '$blue8' }}
                                        size="$4"
                                        disabled={isSubmitting}
                                    />
                                    {errors.date && (
                                        <Text color="$red10" fontSize="$2">{errors.date}</Text>
                                    )}
                                </YStack>

                                {/* Catégorie */}
                                <YStack gap="$1">
                                    <Label color="$color" fontSize="$3" fontWeight="600">
                                        Catégorie <Text color="$red10">*</Text>
                                    </Label>
                                    <Select
                                        value={form.category}
                                        onValueChange={setField('category')}
                                    >
                                        <Select.Trigger iconAfter={ChevronDown}>
                                            <Select.Value placeholder="Sélectionner une catégorie..." />
                                        </Select.Trigger>

                                        <Adapt when="sm" platform="touch">
                                            <Sheet modal dismissOnSnapToBottom>
                                                <Sheet.Frame>
                                                    <Sheet.Handle />
                                                    <Adapt.Contents />
                                                </Sheet.Frame>
                                                <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
                                            </Sheet>
                                        </Adapt>

                                        <Select.Content>
                                            <Select.ScrollUpButton alignItems="center" justifyContent="center" position="relative" width="100%" height="$3">
                                                <YStack zIndex={10}><ChevronUp size={20} /></YStack>
                                            </Select.ScrollUpButton>

                                            <Select.Viewport minWidth={200}>
                                                <Select.Group>
                                                    <Select.Label>Options</Select.Label>
                                                    {CATEGORIES.map((cat, i) => (
                                                        <Select.Item index={i} key={cat} value={cat}>
                                                            <Select.ItemText>{cat}</Select.ItemText>
                                                            <Select.ItemIndicator marginLeft="auto">
                                                                <Check size={16} />
                                                            </Select.ItemIndicator>
                                                        </Select.Item>
                                                    ))}
                                                </Select.Group>
                                            </Select.Viewport>

                                            <Select.ScrollDownButton alignItems="center" justifyContent="center" position="relative" width="100%" height="$3">
                                                <YStack zIndex={10}><ChevronDown size={20} /></YStack>
                                            </Select.ScrollDownButton>
                                        </Select.Content>
                                    </Select>
                                    {errors.category && (
                                        <Text color="$red10" fontSize="$2">{errors.category}</Text>
                                    )}
                                </YStack>

                                {/* Actions */}
                                <XStack gap="$3" marginTop="$4" marginBottom="$6">
                                    <Button
                                        onPress={handleCancel}
                                        variant="outlined"
                                        borderColor="$borderColor"
                                        size="$4"
                                        flex={1}
                                        disabled={isSubmitting}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        onPress={handleSubmit}
                                        backgroundColor="$blue10"
                                        size="$4"
                                        flex={1}
                                        pressStyle={{ opacity: 0.85 }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                                    </Button>
                                </XStack>
                            </YStack>
                        </YStack>

                    </ScrollView>

                </Sheet.Frame>
            </Sheet>
        </PortalProvider>
    )
}
