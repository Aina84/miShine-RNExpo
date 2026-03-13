import { db } from '@/lib/database/db'
import { rapports } from '@/lib/database/schema'
import { activityService } from '@/lib/services/activityService'

import { Check, ChevronDown, X } from '@tamagui/lucide-icons'
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
  TextArea,
  XStack,
  YStack
} from 'tamagui'

type ReportForm = {
  type: string
  title: string
  desc: string
  date: string
  offering: string
  dim: string
  totalPresent: string
  totalNews: string
  author: string
}

const REPORT_TYPES = ['culte', 'dime', 'offrande', 'autre']

type AddReportCardProps = {
  visible: boolean
  onClose: () => void
  onReportAdded?: () => void
}

export function AddReportCard({ visible, onClose, onReportAdded }: AddReportCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<ReportForm>({
    type: 'culte',
    title: '',
    desc: '',
    date: new Date().toISOString().split('T')[0],
    offering: '0',
    dim: '0',
    totalPresent: '0',
    totalNews: '0',
    author: 'Admin'
  })
  const [errors, setErrors] = useState<Partial<ReportForm>>({})

  const validate = () => {
    const newErrors: Partial<ReportForm> = {}
    if (!form.title.trim()) newErrors.title = 'Le titre est requis'
    if (!form.type.trim()) newErrors.type = 'Le type est requis'
    if (!form.date.trim()) newErrors.date = 'La date est requise'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setForm({
      type: 'culte',
      title: '',
      desc: '',
      date: new Date().toISOString().split('T')[0],
      offering: '0',
      dim: '0',
      totalPresent: '0',
      totalNews: '0',
      author: 'Admin'
    })
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await db.insert(rapports).values({
        type: form.type,
        title: form.title,
        desc: form.desc || null,
        date: form.date,
        offering: form.offering,
        dim: parseInt(form.dim) || 0,
        totalPresent: parseInt(form.totalPresent) || 0,
        totalNews: parseInt(form.totalNews) || 0,
        author: form.author || "Admin"
      })

      // Log activity
      await activityService.logActivity("📋", `Nouveau rapport : ${form.title}`);


      console.log('Succès ! Le rapport a été ajouté avec succès')
      resetForm()
      onClose()
      onReportAdded?.()
    } catch (error) {
      console.log("Erreur : Impossible d'ajouter le rapport")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  const setField = (field: keyof ReportForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <PortalProvider shouldAddRootHost>
      <Sheet
        modal
        open={visible}
        onOpenChange={(open: boolean) => { if (!open) handleCancel() }}
        snapPoints={[90]}
        dismissOnSnapToBottom
        dismissOnOverlayPress
        zIndex={100000}
      >
        <Sheet.Overlay
          backgroundColor="rgba(0,0,0,0.5)"
        />
        <Sheet.Handle />
        <Sheet.Frame
          padding="$8"
          backgroundColor="$backgroundStrong"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap="$4">
              {/* En-tête */}
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <H4 color="$color" fontWeight="700">
                    📝 Nouveau Rapport
                  </H4>
                  <Text color="$gray10" fontSize="$3" marginTop="$1">
                    Veuillez remplir les détails du rapport
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

                {/* Type de Rapport */}
                <YStack gap="$1">
                  <Label color="$color" fontSize="$3" fontWeight="600">
                    Type de Rapport <Text color="$red10">*</Text>
                  </Label>
                  <Select
                    value={form.type}
                    onValueChange={setField('type')}
                  >
                    <Select.Trigger iconAfter={ChevronDown}>
                      <Select.Value placeholder="Sélectionner un type..." />
                    </Select.Trigger>

                    <Adapt when="sm" platform="touch">
                      <Sheet modal dismissOnSnapToBottom>
                        <Sheet.Frame>
                          <Sheet.Handle />
                          <Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay />
                      </Sheet>
                    </Adapt>

                    <Select.Content>

                      <Select.Viewport minWidth={200}>
                        <Select.Group>
                          <Select.Label>Types</Select.Label>
                          {REPORT_TYPES.map((type, i) => (
                            <Select.Item index={i} key={type} value={type}>
                              <Select.ItemText textTransform="capitalize">{type}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Viewport>
                    </Select.Content>
                  </Select>
                </YStack>

                {/* Titre */}
                <YStack gap="$1">
                  <Label htmlFor="title" color="$color" fontSize="$3" fontWeight="600">
                    Titre <Text color="$red10">*</Text>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ex: Culte Dominical - 02 Mars"
                    value={form.title}
                    onChangeText={setField('title')}
                    borderColor={errors.title ? '$red8' : '$borderColor'}
                    size="$4"
                    disabled={isSubmitting}
                  />
                  {errors.title && <Text color="$red10" fontSize="$2">{errors.title}</Text>}
                </YStack>

                {/* Date */}
                <YStack gap="$1">
                  <Label htmlFor="date" color="$color" fontSize="$3" fontWeight="600">
                    Date <Text color="$red10">*</Text>
                  </Label>
                  <Input
                    id="date"
                    placeholder="YYYY-MM-DD"
                    value={form.date}
                    onChangeText={setField('date')}
                    size="$4"
                    disabled={isSubmitting}
                  />
                </YStack>

                {/* Finances Wrap */}
                <XStack gap="$3">
                  <YStack gap="$1" flex={1}>
                    <Label fontSize="$3" fontWeight="600">Offrande</Label>
                    <Input
                      keyboardType="numeric"
                      value={form.offering}
                      onChangeText={setField('offering')}
                      size="$4"
                      disabled={isSubmitting}
                    />
                  </YStack>
                  <YStack gap="$1" flex={1}>
                    <Label fontSize="$3" fontWeight="600">Dîme</Label>
                    <Input
                      keyboardType="numeric"
                      value={form.dim}
                      onChangeText={setField('dim')}
                      size="$4"
                      disabled={isSubmitting}
                    />
                  </YStack>
                </XStack>

                {/* Présences Wrap */}
                <XStack gap="$3">
                  <YStack gap="$1" flex={1}>
                    <Label fontSize="$3" fontWeight="600">Présents</Label>
                    <Input
                      keyboardType="numeric"
                      value={form.totalPresent}
                      onChangeText={setField('totalPresent')}
                      size="$4"
                      disabled={isSubmitting}
                    />
                  </YStack>
                  <YStack gap="$1" flex={1}>
                    <Label fontSize="$3" fontWeight="600">Nouveaux</Label>
                    <Input
                      keyboardType="numeric"
                      value={form.totalNews}
                      onChangeText={setField('totalNews')}
                      size="$4"
                      disabled={isSubmitting}
                    />
                  </YStack>
                </XStack>

                {/* Description */}
                <YStack gap="$1">
                  <Label color="$color" fontSize="$3" fontWeight="600">Description</Label>
                  <TextArea
                    placeholder="Détails du rapport..."
                    value={form.desc}
                    onChangeText={setField('desc')}
                    size="$4"
                    numberOfLines={4}
                    minHeight={100}
                    disabled={isSubmitting}
                  />
                </YStack>

                {/* Actions */}
                <XStack gap="$3" marginTop="$4" marginBottom="$8">
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
