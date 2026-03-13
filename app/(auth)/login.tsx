import { useAppTheme } from '@/lib/context/ThemeContext';
import { Eye, EyeOff, Lock, Mail } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Input, Label, Text, XStack, YStack } from 'tamagui';
import { authService } from '../../lib/services/authService';
import { useAppColors } from '../utils/styles';

export default function LoginScreen() {
    const router = useRouter();
    const COLORS = useAppColors();
    const { isDark } = useAppTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await authService.login(email, password);
            if (user) {
                router.replace('/(tabs)/(dashboard)/dashboard');
            } else {
                setError('Email ou mot de passe incorrect');
            }
        } catch (e) {
            setError('Une erreur est survenue lors de la connexion');
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

            <YStack padding="$6" f={1} jc="center" gap="$8">
                <YStack ai="center" gap="$4">
                    <Image
                        style={{ width: 100, height: 100 }}
                        source={require('../../assets/images/icon.png')}
                    />
                    <YStack ai="center">
                        <Text fontSize={32} fontWeight="800" color={COLORS.gold}>miShine</Text>
                        <Text fontSize={14} color={COLORS.textSecondary} opacity={0.8}>Gérer votre église avec excellence</Text>
                    </YStack>
                </YStack>

                <YStack gap="$4">
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
                        onPress={handleLogin}
                        disabled={loading}
                        height={50}
                    >
                        <Text color={isDark ? "black" : "white"} fontWeight="bold">
                            {loading ? 'Connexion...' : 'SE CONNECTER'}
                        </Text>
                    </Button>

                    <XStack jc="center" ai="center" gap="$2" mt="$2">
                        <Text color={COLORS.textSecondary}>Pas de compte ?</Text>
                        <Button
                            chromeless
                            p={0}
                            onPress={() => router.push('/(auth)/register')}
                        >
                            <Text color={COLORS.gold} fontWeight="700">Créer un compte</Text>
                        </Button>
                    </XStack>
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
