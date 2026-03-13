import { useAppTheme } from '@/lib/context/ThemeContext';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, H2, Input, Label, Text, XStack, YStack } from 'tamagui';
import { authService } from '../../lib/services/authService';
import { useAppColors } from '../utils/styles';

export default function RegisterScreen() {
    const router = useRouter();
    const COLORS = useAppColors();
    const { isDark } = useAppTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await authService.register(name, email, password);
            if (user) {
                router.replace('/(tabs)/(dashboard)/dashboard');
            }
        } catch (e: any) {
            setError(e.message || 'Une erreur est survenue lors de la création du compte');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={isDark ? [COLORS.bg, "#0C1530", COLORS.bg] : [COLORS.bg, "#F0F2F5", COLORS.bg]}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />

            <YStack padding="$6" f={1} jc="center" gap="$6">
                <XStack ai="center" gap="$4" position="absolute" top={60} left={20}>
                    <Button circular icon={<ArrowLeft color={COLORS.textPrimary as any} />} onPress={() => router.back()} backgroundColor={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <Text color={COLORS.textPrimary} fontWeight="600">Retour</Text>
                </XStack>

                <YStack ai="center" gap="$4" mt="$8">
                    <Image
                        style={{ width: 80, height: 80 }}
                        source={require('../../assets/images/icon.png')}
                    />
                    <YStack ai="center">
                        <H2 color={COLORS.gold}>Créer un compte</H2>
                        <Text color={COLORS.textSecondary} textAlign="center">Rejoignez la communauté miShine</Text>
                    </YStack>
                </YStack>

                <YStack gap="$4">
                    <YStack gap="$2">
                        <Label fontWeight="600" color={COLORS.textPrimary}>Nom complet</Label>
                        <XStack ai="center" bg={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"} borderRadius="$4" paddingHorizontal="$4" borderWidth={1} borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}>
                            <User size={18} color={COLORS.textMuted as any} />
                            <Input
                                f={1}
                                bw={0}
                                bg="transparent"
                                placeholder="Ex: Jean Dupont"
                                placeholderTextColor={COLORS.textMuted as any}
                                value={name}
                                onChangeText={setName}
                                color={COLORS.textPrimary as any}
                            />
                        </XStack>
                    </YStack>

                    <YStack gap="$2">
                        <Label fontWeight="600" color={COLORS.textPrimary}>Email</Label>
                        <XStack ai="center" bg={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"} borderRadius="$4" paddingHorizontal="$4" borderWidth={1} borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}>
                            <Mail size={18} color={COLORS.textMuted as any} />
                            <Input
                                f={1}
                                bw={0}
                                bg="transparent"
                                placeholder="votre@email.com"
                                placeholderTextColor={COLORS.textMuted as any}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                color={COLORS.textPrimary as any}
                            />
                        </XStack>
                    </YStack>

                    <YStack gap="$2">
                        <Label fontWeight="600" color={COLORS.textPrimary}>Mot de passe</Label>
                        <XStack ai="center" bg={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"} borderRadius="$4" paddingHorizontal="$4" borderWidth={1} borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}>
                            <Lock size={18} color={COLORS.textMuted as any} />
                            <Input
                                f={1}
                                bw={0}
                                bg="transparent"
                                placeholder="••••••••"
                                placeholderTextColor={COLORS.textMuted as any}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                color={COLORS.textPrimary as any}
                            />
                            <Button
                                chromeless
                                p={0}
                                icon={showPassword ? <EyeOff size={18} color={COLORS.textMuted as any} /> : <Eye size={18} color={COLORS.textMuted as any} />}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        </XStack>
                    </YStack>

                    {error ? <Text color="$red10" textAlign="center" fontSize={14}>{error}</Text> : null}

                    <Button
                        backgroundColor={COLORS.gold}
                        onPress={handleRegister}
                        disabled={loading}
                        height={50}
                        mt="$4"
                    >
                        <Text color={isDark ? "black" : "white"} fontWeight="bold">
                            {loading ? 'Création...' : 'CRÉER MON COMPTE'}
                        </Text>
                    </Button>
                </YStack>
            </YStack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
