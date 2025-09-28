import ScreenWrapper from "@/components/ScreenWrapper";
import { Github, Globe, Instagram, Linkedin, Mail } from "lucide-react-native";
import { Linking, ScrollView, Text, View } from "react-native";
import styled from "styled-components/native";

// Styled Components
const Container = styled(ScrollView)`
  flex: 1;
  background-color: #0f0c29;
  padding: 20px;
`;

const Header = styled(View)`
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled(Text)`
  font-size: 28px;
  color: #ffffff;
  font-weight: 800;
  text-align: center;
`;

const Subtitle = styled(Text)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-top: 8px;
`;

const Card = styled(View)`
  background-color: rgba(255, 255, 255, 0.08);
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
`;

const SectionText = styled(Text)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 22px;
`;

const SocialLinks = styled(View)`
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
  gap: 16px;
`;

const styles = {
  content: {
    flex: 1,
  },
};

const IconButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.05);
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoContainer = styled(View)`
  margin-bottom: 30px;
  align-items: center;
`;

const Logo = styled(View)`
  margin-top: 30px;
  width: 120px;
  height: 120px;
  background-color: #8E2DE2;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: no-wrap;
  margin-bottom: 20px;
  transform: rotate(-5deg);
`;

const LogoLetter = styled(Text)`
  font-size: 48px;
  font-weight: 800;
  color: white;
`;

// Improved Palestinian Flag Components
const FlagContainer = styled(View)`
  width: 100%;
  height: 80px;
  margin-vertical: 15px;
  flex-direction: row;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const FlagStripes = styled(View)`
  flex: 1;
  flex-direction: column;
`;

const FlagStripe = styled(View)`
  flex: 1;
  width: 100%;
`;

const FlagTriangle = styled(View)`
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-top-width: 40px;
  border-top-color: transparent;
  border-bottom-width: 40px;
  border-bottom-color: transparent;
  border-left-width: 60px;
  border-left-color: #CE1126;
  z-index: 1;
`;

// Main Component
export default function About() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScreenWrapper>
      <View style={styles.content}>
        <Container contentContainerStyle={{ paddingBottom: 40 }}>
          <Header>
            <Title>About Scrabble Puzzle</Title>
            <LogoContainer>
              <Logo>
                <LogoLetter>S</LogoLetter>
                <LogoLetter>P</LogoLetter>
              </Logo>
            </LogoContainer>
            <Subtitle>Challenge your vocabulary skills and expand your knowledge!</Subtitle>
          </Header>

          <Card>
            <SectionTitle>Creator</SectionTitle>
            <SectionText>
              Mohamed Ghoul, Full-Stack JS Developer. Passionate about building interactive and fun learning experiences with React Native.
            </SectionText>

            <SocialLinks>
              <IconButton onPress={() => openLink("https://www.instagram.com/mohavvvvd")}>
                <Instagram size={24} color="rgba(255,255,255,0.8)" />
              </IconButton>
              <IconButton onPress={() => openLink("https://www.linkedin.com/in/mohamed-ghoul-224982287")}>
                <Linkedin size={24} color="rgba(255,255,255,0.8)" />
              </IconButton>
              <IconButton onPress={() => openLink("https://github.com/mohavvvvd")}>
                <Github size={24} color="rgba(255,255,255,0.8)" />
              </IconButton>
              <IconButton onPress={() => openLink("mailto:mohavvvvd.2021@gmail.com")}>
                <Mail size={24} color="rgba(255,255,255,0.8)" />
              </IconButton>
              <IconButton onPress={() => openLink("https://mohavvvvd.netlify.app")}>
    <Globe size={24} color="rgba(255,255,255,0.8)" />
  </IconButton>
            </SocialLinks>
          </Card>

          <Card>
            <SectionTitle>Contact</SectionTitle>
            <SectionText>
              For inquiries, suggestions, or feedback, feel free to contact me via email:
            </SectionText>
            <SectionText style={{ marginTop: 8, fontWeight: "600" }}>
              mohavvvvd.2021@gmail.com
            </SectionText>
          </Card>

          <Card>
            <SectionTitle>About This App</SectionTitle>
            <SectionText>
              Scrabble Puzzle is a word game designed to improve your vocabulary and provide hours of fun. 
              Build words, challenge yourself, and see how high you can score!
            </SectionText>
          </Card>

          {/* Improved Palestine section */}
          <Card>
            <SectionTitle>Stand With Palestine 🇵🇸</SectionTitle>
            <SectionText>
              As we build apps and games to bring joy to people around the world, we cannot ignore the ongoing genocide in Gaza. 
              Since October 2023, over 35,000 Palestinians have been killed, including more than 14,000 children, by Israeli forces.
            </SectionText>
            
            <FlagContainer>
  <FlagTriangle />
  <FlagStripes>
    <FlagStripe style={{ backgroundColor: '#000000' }} />
    <FlagStripe style={{ backgroundColor: '#FFFFFF' }} />
    <FlagStripe style={{ backgroundColor: '#007A3D' }} />
  </FlagStripes>
</FlagContainer>
            
            <SectionText>
              We stand in solidarity with the Palestinian people in their struggle for freedom, justice, and equality. 
              We call for an immediate ceasefire, an end to the occupation, and the establishment of a free Palestinian state.
            </SectionText>
            
            <SectionText style={{marginTop: 10, fontStyle: 'italic'}}>
              "Injustice anywhere is a threat to justice everywhere." - Martin Luther King Jr.
            </SectionText>
          </Card>
        </Container>
      </View>
    </ScreenWrapper>
  );
}