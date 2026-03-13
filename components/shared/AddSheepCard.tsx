import { db } from '@/lib/database/db'
import { sheeps } from '@/lib/database/schema'
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
  TextArea,
  XStack,
  YStack
} from 'tamagui'

type PersonForm = {
  name: string
  contact: string
  adress: string
  description: string
  role: string
  sexe: string
  status: string
}

const ROLES = ['Choral', 'Securité', 'Interceseur', 'Accueil', 'Diakona', 'Assistant', 'Staff', 'Tsotra']
const SEXES = ['Masculin', 'Feminin']

type AddSheepCardProps = {
  visible: boolean
  onClose: () => void
  onUserAdded?: () => void
}

export function AddSheepCard({ visible, onClose, onUserAdded }: AddSheepCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<PersonForm>({
    name: '',
    contact: '',
    adress: '',
    description: '',
    role: '',
    sexe: '',
    status: ''
  })
  const [errors, setErrors] = useState<Partial<PersonForm>>({})

  const validate = () => {
    const newErrors: Partial<PersonForm> = {}
    if (!form.name.trim()) newErrors.name = 'Le nom est requis'
    if (!form.contact.trim()) newErrors.contact = 'Le contact est requis'
    if (!form.adress.trim()) newErrors.adress = "L'adresse est requise"
    if (!form.description.trim()) newErrors.description = 'La description est requise'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setForm({ name: '', contact: '', adress: '', description: '', role: '', sexe: '', status: '' })
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await db.insert(sheeps).values({
        name: form.name,
        contact: form.contact,
        adress: form.adress,
        description: form.description,
        role: form.role || null,
        sexe: form.sexe,
        status: form.status,
      })

      // Log activity
      await activityService.logActivity("👤", `Nouveau membre : ${form.name}`);


      console.log('Succès ! La personne a été ajoutée avec succès')

      const dataTest = await db.select().from(sheeps)
      console.log(dataTest);

      resetForm()
      onClose()
      onUserAdded?.()
    } catch (error) {
      console.log("Erreur : Impossible d'ajouter la personne")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  const setField = (field: keyof PersonForm) => (value: string) => {
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
                    ➕ Nouvelle Personne
                  </H4>
                  <Text color="$gray10" fontSize="$3" marginTop="$1">
                    Remplissez les informations ci-dessous
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
                {/* Nom */}
                <YStack gap="$1">
                  <Label htmlFor="name" color="$color" fontSize="$3" fontWeight="600">
                    Nom <Text color="$red10">*</Text>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Jean Dupont"
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

                {/* Contact */}
                <YStack gap="$1">
                  <Label htmlFor="contact" color="$color" fontSize="$3" fontWeight="600">
                    Contact <Text color="$red10">*</Text>
                  </Label>
                  <Input
                    id="contact"
                    placeholder="Ex: +261 34 00 000 00"
                    value={form.contact}
                    onChangeText={setField('contact')}
                    keyboardType="phone-pad"
                    borderColor={errors.contact ? '$red8' : '$borderColor'}
                    focusStyle={{ borderColor: '$blue8' }}
                    size="$4"
                    disabled={isSubmitting}
                  />
                  {errors.contact && (
                    <Text color="$red10" fontSize="$2">{errors.contact}</Text>
                  )}
                </YStack>

                {/* Adresse */}
                <YStack gap="$1">
                  <Label htmlFor="adress" color="$color" fontSize="$3" fontWeight="600">
                    Adresse <Text color="$red10">*</Text>
                  </Label>
                  <Input
                    id="adress"
                    placeholder="Ex: Lot 12, Antananarivo"
                    value={form.adress}
                    onChangeText={setField('adress')}
                    borderColor={errors.adress ? '$red8' : '$borderColor'}
                    focusStyle={{ borderColor: '$blue8' }}
                    size="$4"
                    disabled={isSubmitting}
                  />
                  {errors.adress && (
                    <Text color="$red10" fontSize="$2">{errors.adress}</Text>
                  )}
                </YStack>

                {/* Description */}
                <YStack gap="$1">
                  <Label htmlFor="description" color="$color" fontSize="$3" fontWeight="600">
                    Description <Text color="$red10">*</Text>
                  </Label>
                  <TextArea
                    id="description"
                    placeholder="Décrivez cette personne..."
                    value={form.description}
                    onChangeText={setField('description')}
                    borderColor={errors.description ? '$red8' : '$borderColor'}
                    focusStyle={{ borderColor: '$blue8' }}
                    size="$4"
                    numberOfLines={3}
                    minHeight={80}
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <Text color="$red10" fontSize="$2">{errors.description}</Text>
                  )}
                </YStack>

                {/* Rôle */}
                <YStack gap="$1">
                  <Label color="$color" fontSize="$3" fontWeight="600">
                    Rôle <Text color="$gray9">(optionnel)</Text>
                  </Label>
                  <Select
                    value={form.role}
                    onValueChange={setField('role')}
                  >
                    <Select.Trigger iconAfter={ChevronDown}>
                      <Select.Value placeholder="Sélectionner un rôle..." />
                    </Select.Trigger>

                    <Adapt when="sm" platform="touch">
                      <Sheet
                        modal
                        dismissOnSnapToBottom
                      >
                        <Sheet.Frame>
                          <Sheet.Handle />
                          <Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay
                          enterStyle={{ opacity: 0 }}
                          exitStyle={{ opacity: 0 }}
                        />
                      </Sheet>
                    </Adapt>

                    <Select.Content >
                      <Select.ScrollUpButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                      >
                        <YStack zIndex={10}>
                          <ChevronUp size={20} />
                        </YStack>
                      </Select.ScrollUpButton>

                      <Select.Viewport minWidth={200}>
                        <Select.Group>
                          <Select.Label>Options</Select.Label>
                          {ROLES.map((role, i) => (
                            <Select.Item
                              index={i}
                              key={role}
                              value={role}
                            >
                              <Select.ItemText>{role}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Viewport>

                      <Select.ScrollDownButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                      >
                        <YStack zIndex={10}>
                          <ChevronDown size={20} />
                        </YStack>
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select>
                </YStack>
                {/* sexe */}
                <YStack gap="$1">
                  <Label color="$color" fontSize="$3" fontWeight="600">
                    Sexe <Text color="$gray9">(optionnel)</Text>
                  </Label>
                  <Select
                    value={form.sexe}
                    onValueChange={setField('sexe')}
                  >
                    <Select.Trigger iconAfter={ChevronDown}>
                      <Select.Value placeholder="Sélectionner un genre..." />
                    </Select.Trigger>

                    <Adapt when="sm" platform="touch">
                      <Sheet
                        modal
                        dismissOnSnapToBottom
                      >
                        <Sheet.Frame>
                          <Sheet.Handle />
                          <Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay
                          enterStyle={{ opacity: 0 }}
                          exitStyle={{ opacity: 0 }}
                        />
                      </Sheet>
                    </Adapt>

                    <Select.Content>
                      <Select.ScrollUpButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                      >
                        <YStack zIndex={10}>
                          <ChevronUp size={20} />
                        </YStack>
                      </Select.ScrollUpButton>

                      <Select.Viewport minWidth={200}>
                        <Select.Group>
                          <Select.Label>Options</Select.Label>
                          <Select.Item
                            index={0}
                            key={0}
                            value={"homme"}
                          >
                            <Select.ItemText>Homme</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            index={1}
                            key={1}
                            value={"femme"}
                          >
                            <Select.ItemText>Femme</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        </Select.Group>
                      </Select.Viewport>

                      <Select.ScrollDownButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                      >
                        <YStack zIndex={10}>
                          <ChevronDown size={20} />
                        </YStack>
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select>
                </YStack>
                {/* status */}
                <YStack gap="$1">
                  <Label color="$color" fontSize="$3" fontWeight="600">
                    Status <Text color="$gray9">(optionnel)</Text>
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={setField('status')}
                  >
                    <Select.Trigger iconAfter={ChevronDown}>
                      <Select.Value placeholder="Sélectionner status..." />
                    </Select.Trigger>

                    <Adapt when="sm" platform="touch">
                      <Sheet
                        modal
                        dismissOnSnapToBottom
                      >
                        <Sheet.Frame>
                          <Sheet.Handle />
                          <Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay
                          enterStyle={{ opacity: 0 }}
                          exitStyle={{ opacity: 0 }}
                        />
                      </Sheet>
                    </Adapt>

                    <Select.Content>
                      <Select.ScrollUpButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                      >
                        <YStack zIndex={10}>
                          <ChevronUp size={20} />
                        </YStack>
                      </Select.ScrollUpButton>

                      <Select.Viewport minWidth={200}>
                        <Select.Group>
                          <Select.Label>status</Select.Label>
                          <Select.Item
                            index={0}
                            key={0}
                            value={"actif"}
                          >
                            <Select.ItemText>actif</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            index={1}
                            key={1}
                            value={"inactif"}
                          >
                            <Select.ItemText>inactif</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            index={2}
                            key={2}
                            value={"quitter"}
                          >
                            <Select.ItemText>quitter</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        </Select.Group>
                      </Select.Viewport>

                      <Select.ScrollDownButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                      >
                        <YStack zIndex={10}>
                          <ChevronDown size={20} />
                        </YStack>
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select>
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