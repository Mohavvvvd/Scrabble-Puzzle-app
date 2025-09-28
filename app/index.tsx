import { useRouter } from "expo-router";
import { Github, Globe, Instagram, Linkedin, Mail } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing, Linking, StyleSheet,  
  Text,
  TouchableOpacity,
  View
} from "react-native";
import styled from "styled-components/native";


const router = useRouter();

interface EntryPageProps {
  onStart: () => void;
}

const { width, height } = Dimensions.get("window");

// Styled Components
const EntryContainer = styled(View)`
  flex: 1;
  background-color: #0f0c29;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const MainContainer = styled(View)`
  background-color: rgba(255, 255, 255, 0.08);
  padding: 40px;
  border-radius: 24px;
  align-items: center;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoContainer = styled(View)`
  margin-bottom: 30px;
  align-items: center;
`;
const IconButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.05);
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled(View)`
  width: 120px;
  height: 120px;
  background-color: #8E2DE2;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-bottom: 20px;
  transform: rotate(-5deg);
`;

const LogoLetter = styled(Text)`
  font-size: 48px;
  font-weight: 800;
  color: white;
`;

const AppTitle = styled(Text)`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  text-align: center;
`;

const AppSubtitle = styled(Text)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  font-weight: 400;
  text-align: center;
  line-height: 24px;
`;

const CreatorInfo = styled(View)`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;
`;

const CreatorLabel = styled(Text)`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 500;
`;

const CreatorName = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

const CreatorTitle = styled(Text)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
`;

const SocialLinks = styled(View)`
  flex-direction: row;
  align-self: streach;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
`;

const StartButton = styled(TouchableOpacity)`
  background-color: #8E2DE2;
  padding: 16px 40px;
  border-radius: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
`;

const ButtonText = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: white;
`;

const Copyright = styled(Text)`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

const FloatingLetter = styled(Animated.Text)`
  position: absolute;
  font-size: 48px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.07);
`;

// Main Component
const EntryPage: React.FC<EntryPageProps> = ({ onStart }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
    return () => floatAnim.stopAnimation();
  }, [floatAnim]);

  // Floating transforms
  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });
  const rotate = floatAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '5deg'] });
  const rotateInverse = floatAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-5deg'] });
  const openLink = (url: string) => {
      Linking.openURL(url);
    };

  return (
    <EntryContainer>
      {/* Floating Letters */}
      <FloatingLetter style={[styles.letter1, { transform: [{ translateY }, { rotate }] }]}>S</FloatingLetter>
      <FloatingLetter style={[styles.letter2, { transform: [{ translateY }, { rotate: rotateInverse }] }]}>C</FloatingLetter>
      <FloatingLetter style={styles.letter3}>R</FloatingLetter>
      <FloatingLetter style={styles.letter4}>A</FloatingLetter>
      <FloatingLetter style={styles.letter5}>B</FloatingLetter>
      <FloatingLetter style={styles.letter6}>B</FloatingLetter>
      <FloatingLetter style={styles.letter7}>L</FloatingLetter>
      <FloatingLetter style={styles.letter8}>E</FloatingLetter>

      <MainContainer>
        <LogoContainer>
          <Logo>
            <LogoLetter>S</LogoLetter>
            <LogoLetter>P</LogoLetter>
          </Logo>
        </LogoContainer>

        <AppTitle>Scrabble Puzzle</AppTitle>
        <AppSubtitle>Challenge your word skills and expand your vocabulary</AppSubtitle>

        <CreatorInfo>
          <CreatorLabel>Created by</CreatorLabel>
          <CreatorName>Mohamed Ghoul</CreatorName>
          <CreatorTitle>Full-Stack JS Developer</CreatorTitle>
        </CreatorInfo>

        <SocialLinks>
  <IconButton onPress={() => openLink("https://www.instagram.com/mohavvvvd")}>
    <Instagram size={19} color="rgba(255,255,255,0.8)" />
  </IconButton>
  <IconButton onPress={() => openLink("https://www.linkedin.com/in/mohamed-ghoul-224982287")}>
    <Linkedin size={19} color="rgba(255,255,255,0.8)" />
  </IconButton>
  <IconButton onPress={() => openLink("https://github.com/mohavvvvd")}>
    <Github size={19} color="rgba(255,255,255,0.8)" />
  </IconButton>
  <IconButton onPress={() => openLink("mailto:mohavvvvd.2021@gmail.com")}>
    <Mail size={19} color="rgba(255,255,255,0.8)" />
  </IconButton>
   <IconButton onPress={() => openLink("https://mohavvvvd.netlify.app/")}>
    <Globe size={19} color="rgba(255,255,255,0.8)" />
  </IconButton>
</SocialLinks>

        <StartButton onPress={() => router.push("/(tabs)/Game")}>
          <Text style={{ fontSize: 20 }}>🎮</Text>
          <ButtonText >Start Playing</ButtonText>
        </StartButton>

        <Copyright>
          &copy; {new Date().getFullYear()} Mohamed Ghoul. All rights reserved.
        </Copyright>
      </MainContainer>
    </EntryContainer>
  );
};

const styles = StyleSheet.create({
  letter1: { top: '10%', left: '5%', color: 'rgba(142, 45, 226, 0.1)' },
  letter2: { top: '20%', right: '10%', color: 'rgba(74, 0, 224, 0.1)' },
  letter3: { bottom: '30%', left: '15%', color: 'rgba(142, 45, 226, 0.1)' },
  letter4: { bottom: '20%', right: '8%', color: 'rgba(74, 0, 224, 0.1)' },
  letter5: { top: '50%', left: '3%', color: 'rgba(142, 45, 226, 0.1)' },
  letter6: { top: '60%', right: '3%', color: 'rgba(74, 0, 224, 0.1)' },
  letter7: { bottom: '10%', left: '20%', color: 'rgba(142, 45, 226, 0.1)' },
  letter8: { top: '15%', right: '20%', color: 'rgba(74, 0, 224, 0.1)' },
});

export default EntryPage;
