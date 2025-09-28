import ScreenWrapper from '@/components/ScreenWrapper';
import { HelpCircle, Lightbulb, RefreshCw, Trophy } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import styled from "styled-components/native";

// Scrabble letter points
const LETTER_POINTS: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
  J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1,
  S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const NUM_WORDS = 5;
const { width, height } = Dimensions.get("window");

// Type definitions
interface SelectedLetter {
  letter: string;
  index: number;
}

interface ShakeAnimations {
  [key: string]: Animated.Value;
}

interface FloatingLetter {
  id: number;
  letter: string;
  size: number;
  left: number;
  top: number;
  opacity: number;
  duration: number;
  delay: number;
}

// Styled Components
const GameContainer = styled(View)`
  flex: 1;
  background-color: #0f0c29;
  padding: 20px;
`;

const FloatingLettersContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

const FloatingLetterText = styled(Animated.Text)`
  position: absolute;
  color: rgba(255, 255, 255, 0.07);
  font-weight: bold;
`;

const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 15px;
  flex-wrap: wrap;
  z-index: 1;
`;

const HeaderLeft = styled(View)`
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 200px;
`;

const GameTitle = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 5px;
`;

const ScoreDisplay = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
`;

const ScoreText = styled(Text)`
  color: #FFD700;
  font-weight: 700;
  margin-left: 5px;
`;

const HeaderRight = styled(View)`
  flex-direction: row;
  justify-content: center;   
  align-items: center;      
  width: 100%;            
  gap: 10px;                
`;

const HelpButton = styled(TouchableOpacity)`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const HintButton = styled(TouchableOpacity)`
  background-color: rgba(255, 215, 0, 0.3);
  height: 30px;
  width: 60px;
  border-radius: 20px;
  padding: 6px ;
  flex-direction: row;
  align-items: center;
`;

const InstructionsPanel = styled(View)`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 15px;
`;

const CloseInstructions = styled(TouchableOpacity)`
  background-color: #8E2DE2;
  padding: 8px 16px;
  border-radius: 20px;
  align-items: center;
  margin-top: 10px;
  align-self: center;
`;

const GameContent = styled(View)`
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  flex: 1;
  z-index: 1;
`;

const WordsGrid = styled(ScrollView)`
  flex: 1;
  margin-bottom: 15px;
`;

const WordRow = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  justify-content: center;
`;

const WordNumber = styled(Text)`
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.1);
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 8px;
  margin-right: 5px;
  color: white;
`;

interface ScrabbleTileProps {
  empty: boolean;
}

const ScrabbleTile = styled(TouchableOpacity)<ScrabbleTileProps>`
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-width: 3px;
  border-radius: 10px;
  margin: 4px;
  background-color: ${props => props.empty ? 'rgba(255, 255, 255, 0.1)' : '#8E2DE2'};
  border-color: ${props => props.empty ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'};
`;

const TileLetter = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

const TilePoints = styled(Text)`
  position: absolute;
  bottom: 3px;
  right: 3px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

const HiddenPoints = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
`;

const LetterPool = styled(View)`
  max-height: ${height * 0.3}px;
  margin-top: 15px;
  padding-top: 15px;
`;

const PoolLabel = styled(Text)`
  text-align: center;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
`;

const LettersContainer = styled(ScrollView)`
  max-height: ${height * 0.2}px;
  flex-grow: 0;
`;

const LettersRow = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding-vertical: 5px;
`;

interface LetterButtonProps {
  selected: boolean;
}

const LetterButton = styled(TouchableOpacity)<LetterButtonProps>`
  width: 45px;
  height: 45px;
  background-color: rgba(255, 215, 0, 0.9);
  border-width: 2px;
  border-color: ${props => props.selected ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin: 4px;
  transform: ${props => props.selected ? 'scale(1.1)' : 'scale(1)'};
`;

const ButtonLetter = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  color: #2c3e50;
`;

const ButtonPoints = styled(Text)`
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(44, 62, 80, 0.8);
`;

const CompletionMessage = styled(View)`
  background-color: rgba(76, 175, 80, 0.9);
  padding: 20px;
  border-radius: 16px;
  margin-top: 20px;
  align-items: center;
`;

const ResetButton = styled(TouchableOpacity)`
  background-color: #8E2DE2;
  padding: 12px 24px;
  border-radius: 25px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
   backgroundColor:#0f0c29;
`;

const TutorialModal = styled(Modal)`
  flex: 1;
`;

const TutorialOverlay = styled(View)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const TutorialContent = styled(View)`
  background-color: white;
  border-radius: 16px;
  padding: 25px;
  width: 90%;
  max-width: 400px;
`;

const TutorialTitle = styled(Text)`
  font-size: 22px;
  font-weight: 700;
  color: #0f0c29;
  margin-bottom: 15px;
  text-align: center;
`;

const TutorialText = styled(Text)`
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 22px;
`;

const TutorialHighlight = styled(Text)`
  font-weight: 700;
  color: #8E2DE2;
`;

const TutorialButton = styled(TouchableOpacity)`
  background-color: #8E2DE2;
  padding: 12px 24px;
  border-radius: 25px;
  align-items: center;
  margin-top: 10px;
`;

const TutorialButtonText = styled(Text)`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const HelpCounterText = styled(Text)`
  color: #FFD700;
  font-weight: 600;
  margin-left: 5px;
`;

const styles = {
  content: {
    flex: 1,
  },
};

// Helper function to generate random floating letters
const generateFloatingLetters = (count: number): FloatingLetter[] => {
  const letters = Object.keys(LETTER_POINTS);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    letter: letters[Math.floor(Math.random() * letters.length)],
    size: Math.random() * 30 + 20,
    left: Math.random() * width,
    top: Math.random() * height,
    opacity: Math.random() * 0.1 + 0.03,
    duration: Math.random() * 10000 + 15000,
    delay: Math.random() * 5000,
  }));
};

// Main Game Component
const Game: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [placedLetters, setPlacedLetters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLetter, setSelectedLetter] = useState<SelectedLetter | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [helpsRemaining, setHelpsRemaining] = useState<number>(2);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [floatingLetters, setFloatingLetters] = useState<FloatingLetter[]>([]);
  const shakeAnimations = useRef<ShakeAnimations>({});
  const lettersScrollViewRef = useRef<ScrollView>(null);
  const wordsScrollViewRef = useRef<ScrollView>(null);
  const floatingAnimations = useRef<Animated.Value[]>([]);

  // Initialize floating letters
  useEffect(() => {
    setFloatingLetters(generateFloatingLetters(15));
  }, []);

  // Animate floating letters
  useEffect(() => {
    floatingAnimations.current = floatingLetters.map(() => new Animated.Value(0));
    
    const animations = floatingLetters.map((letter, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(letter.delay),
          Animated.timing(floatingAnimations.current[index], {
            toValue: 1,
            duration: letter.duration,
            useNativeDriver: true,
          })
        ])
      );
    });
    
    animations.forEach(animation => animation.start());
    
    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [floatingLetters]);

  // Fetch words
  const fetchWords = async (): Promise<void> => {
    setLoading(true);
    setPlacedLetters({});
    setSelectedLetter(null);
    setScore(0);
    setHelpsRemaining(5);
    try {
      const res = await fetch(`https://random-word-api.vercel.app/api?words=${NUM_WORDS}`);
      const data = await res.json();
      const upperWords = data.map((w: string) => w.toUpperCase());
      setWords(upperWords);

      const allLetters = upperWords.flatMap((w: string) => w.split(''));
      const shuffledLetters = allLetters.sort(() => Math.random() - 0.5);
      setAvailableLetters(shuffledLetters);
    } catch (err) {
      console.error(err);
      // Fallback words if API fails
      const fallbackWords = ["REACT", "TYPESCRIPT", "SCRABBLE", "PUZZLE", "DESIGN"];
      setWords(fallbackWords);
      
      const allLetters = fallbackWords.flatMap(w => w.split(''));
      const shuffledLetters = allLetters.sort(() => Math.random() - 0.5);
      setAvailableLetters(shuffledLetters);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchWords(); 
  }, []);

  // Initialize shake animations
  useEffect(() => {
    words.forEach((word, wordIndex) => {
      word.split('').forEach((_, letterIndex) => {
        const positionKey = `${wordIndex}-${letterIndex}`;
        shakeAnimations.current[positionKey] = new Animated.Value(0);
      });
    });
  }, [words]);

  // Letter select
  const handleLetterSelect = (letter: string, index: number): void => {
    setSelectedLetter({ letter, index });
    
    // Scroll to the selected letter if it's not fully visible
    setTimeout(() => {
      if (lettersScrollViewRef.current) {
        const xPos = index * 53; // 45px width + 8px margin
        lettersScrollViewRef.current.scrollTo({ x: xPos, animated: true });
      }
    }, 100);
  };

  // Shake animation
  const shake = (positionKey: string): void => {
    if (!shakeAnimations.current[positionKey]) return;
    
    Animated.sequence([
      Animated.timing(shakeAnimations.current[positionKey], {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimations.current[positionKey], {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimations.current[positionKey], {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimations.current[positionKey], {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Place letter
  const handlePositionClick = (wordIndex: number, letterIndex: number): void => {
    if (!selectedLetter) return;
    const targetLetter = words[wordIndex][letterIndex];
    const positionKey = `${wordIndex}-${letterIndex}`;

    if (placedLetters[positionKey]) return;

    if (selectedLetter.letter === targetLetter) {
      setPlacedLetters(prev => ({ ...prev, [positionKey]: selectedLetter.letter }));
      setAvailableLetters(prev => prev.filter((_, i) => i !== selectedLetter.index));
      setSelectedLetter(null);
      setScore(prev => prev + (LETTER_POINTS[selectedLetter.letter] || 0));
    } else {
      shake(positionKey);
    }
  };

  // Use a hint
  const useHint = (): void => {
    if (helpsRemaining <= 0) return;
    
    // Find an unplaced letter position
    const unplacedPositions: {wordIndex: number, letterIndex: number}[] = [];
    
    words.forEach((word, wordIndex) => {
      word.split('').forEach((letter, letterIndex) => {
        const positionKey = `${wordIndex}-${letterIndex}`;
        if (!placedLetters[positionKey]) {
          unplacedPositions.push({wordIndex, letterIndex});
        }
      });
    });
    
    if (unplacedPositions.length === 0) return;
    
    // Select a random unplaced position
    const randomPosition = unplacedPositions[Math.floor(Math.random() * unplacedPositions.length)];
    const {wordIndex, letterIndex} = randomPosition;
    const correctLetter = words[wordIndex][letterIndex];
    const positionKey = `${wordIndex}-${letterIndex}`;
    
    // Find the letter in available letters
    const letterIndexInPool = availableLetters.findIndex(l => l === correctLetter);
    
    if (letterIndexInPool !== -1) {
      // Place the letter
      setPlacedLetters(prev => ({ ...prev, [positionKey]: correctLetter }));
      setAvailableLetters(prev => prev.filter((_, i) => i !== letterIndexInPool));
      setScore(prev => prev + (LETTER_POINTS[correctLetter] || 0));
      setHelpsRemaining(prev => (prev > 0 ? prev - 1 : 0));
      
      // Scroll to the placed letter in the words grid
      setTimeout(() => {
        if (wordsScrollViewRef.current) {
          wordsScrollViewRef.current.scrollTo({ y: wordIndex * 70, animated: true });
        }
      }, 100);
    }
  };

  const completedWords = words.filter((word, wordIndex) =>
    word.split('').every((_, letterIndex) => placedLetters[`${wordIndex}-${letterIndex}`])
  );
  const isGameComplete = completedWords.length === words.length && words.length > 0;

  const resetGame = (): void => {
    fetchWords();
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#8E2DE2" />
        <Text style={{ color: '#8E2DE2', fontSize: 16 }}>Loading words...</Text>
      </LoadingContainer>
    );
  }

  return (
     <ScreenWrapper>
      <View style={styles.content}>
        <GameContainer>
          <StatusBar barStyle="light-content" />
          
          {/* Floating Letters Background */}
          <FloatingLettersContainer>
            {floatingLetters.map((floatingLetter, index) => {
              const translateY = floatingAnimations.current[index]?.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, -15, 0],
              });
              
              const rotate = floatingAnimations.current[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '5deg'],
              });
              
              return (
                <FloatingLetterText
                  key={floatingLetter.id}
                  style={{
                    fontSize: floatingLetter.size,
                    left: floatingLetter.left,
                    top: floatingLetter.top,
                    opacity: floatingLetter.opacity,
                    transform: [{ translateY }, { rotate }],
                  }}
                >
                  {floatingLetter.letter}
                </FloatingLetterText>
              );
            })}
          </FloatingLettersContainer>
          
          {/* Tutorial Modal */}
          <TutorialModal
            visible={showTutorial}
            transparent={true}
            animationType="fade"
          >
            <TutorialOverlay>
              <TutorialContent>
                <TutorialTitle>How to Play</TutorialTitle>
                <TutorialText>
                  <TutorialHighlight>1.</TutorialHighlight> Select a letter from the bottom panel by tapping on it.
                </TutorialText>
                <TutorialText>
                  <TutorialHighlight>2.</TutorialHighlight> Tap on an empty tile where you think the letter belongs.
                </TutorialText>
                <TutorialText>
                  <TutorialHighlight>3.</TutorialHighlight> If correct, the letter will stay. If wrong, the tile will shake.
                </TutorialText>
                <TutorialText>
                  <TutorialHighlight>4.</TutorialHighlight> Scroll horizontally through the available letters if they don't all fit on screen.
                </TutorialText>
                <TutorialText>
                  <TutorialHighlight>5.</TutorialHighlight> You have <TutorialHighlight>5 helps</TutorialHighlight> available. Use them wisely!
                </TutorialText>
                <TutorialButton onPress={() => setShowTutorial(false)}>
                  <TutorialButtonText>Got It!</TutorialButtonText>
                </TutorialButton>
              </TutorialContent>
            </TutorialOverlay>
          </TutorialModal>

          <Header>
            <HeaderLeft>
              <GameTitle>Scrabble Puzzle</GameTitle>
            </HeaderLeft>
            
            <HeaderRight>
              <HelpButton onPress={() => setShowInstructions(!showInstructions)}>
                <HelpCircle size={20} color="white" />
              </HelpButton>
              
              <HintButton 
                onPress={useHint} 
                disabled={helpsRemaining == 0 || isGameComplete}
                style={{ opacity: helpsRemaining == 0 || isGameComplete ? 0.5 : 1 }}
              >
                <Lightbulb size={18} color="#FFD700" />
                
                  <HelpCounterText>{helpsRemaining}/5</HelpCounterText>
              </HintButton>
              
              <ScoreDisplay>
                <Trophy size={18} color="#FFD700" />
                <ScoreText>{score} pts</ScoreText>
                <Text style={{ color: 'white', opacity: 0.7, marginHorizontal: 5 }}>|</Text>
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  {completedWords.length}/{NUM_WORDS}
                </Text>
              </ScoreDisplay>
            </HeaderRight>
          </Header>

          {showInstructions && (
            <InstructionsPanel>
              <Text style={{ marginBottom: 10, fontWeight: '600', color: '#2c3e50' }}>
                How to Play
              </Text>
              <Text style={{ marginBottom: 15, lineHeight: 20, color: '#2c3e50' }}>
                Select a letter from the bottom panel and tap on the empty tile where you think it belongs. 
                Complete all words to win!
              </Text>
              <Text style={{ marginBottom: 15, lineHeight: 20, color: '#2c3e50' }}>
                <Text style={{ fontWeight: '700' }}>Tip:</Text> Scroll horizontally through the available letters if they don't all fit on screen.
              </Text>
              <Text style={{ marginBottom: 15, lineHeight: 20, color: '#2c3e50' }}>
                You have <Text style={{ fontWeight: '700' }}>2 helps</Text> available. Use them to reveal correct letters!
              </Text>
              <CloseInstructions onPress={() => setShowInstructions(false)}>
                <Text style={{ color: 'white', fontWeight: '500' }}>Got it!</Text>
              </CloseInstructions>
            </InstructionsPanel>
          )}

          <GameContent>
            <WordsGrid ref={wordsScrollViewRef}>
              {words.map((word, wordIndex) => (
                <WordRow key={wordIndex}>
                  <WordNumber>{wordIndex + 1}.</WordNumber>
                  {word.split('').map((letter, letterIndex) => {
                    const positionKey = `${wordIndex}-${letterIndex}`;
                    const isPlaced = !!placedLetters[positionKey];
                    
                    return (
                      <Animated.View
                        key={letterIndex}
                        style={{
                          transform: [{ translateX: shakeAnimations.current[positionKey] || 0 }]
                        }}
                      >
                        <ScrabbleTile
                          empty={!isPlaced}
                          onPress={() => handlePositionClick(wordIndex, letterIndex)}
                        >
                          {isPlaced ? (
                            <>
                              <TileLetter>{letter}</TileLetter>
                              <TilePoints>{LETTER_POINTS[letter] || 0}</TilePoints>
                            </>
                          ) : (
                            <HiddenPoints>{LETTER_POINTS[letter] || 0}</HiddenPoints>
                          )}
                        </ScrabbleTile>
                      </Animated.View>
                    );
                  })}
                </WordRow>
              ))}
            </WordsGrid>

            <LetterPool>
              <PoolLabel>Available Letters (scroll horizontally)</PoolLabel>
              <LettersContainer 
                ref={lettersScrollViewRef}
                horizontal={true}
                showsHorizontalScrollIndicator={true}
              >
                <LettersRow>
                  {availableLetters.map((letter, index) => (
                    <LetterButton
                      key={index}
                      selected={selectedLetter?.index === index}
                      onPress={() => handleLetterSelect(letter, index)}
                    >
                      <ButtonLetter>{letter}</ButtonLetter>
                      <ButtonPoints>{LETTER_POINTS[letter] || 0}</ButtonPoints>
                    </LetterButton>
                  ))}
                </LettersRow>
              </LettersContainer>
            </LetterPool>

            {isGameComplete && (
              <CompletionMessage>
                <Text style={{ fontSize: 20, fontWeight: '700', color: 'white', marginBottom: 10 }}>
                  🎉 Congratulations!
                </Text>
                <Text style={{ marginBottom: 15, fontSize: 14, color: 'white', textAlign: 'center' }}>
                  You've completed all the words with a score of {score} points!
                </Text>
                <Text style={{ marginBottom: 15, fontSize: 14, color: 'white', textAlign: 'center' }}>
                  Helps remaining: {helpsRemaining}
                </Text>
                <ResetButton onPress={resetGame}>
                  <RefreshCw size={16} color="white" />
                  <Text style={{ color: 'white', fontWeight: '600' }}>Play Again</Text>
                </ResetButton>
              </CompletionMessage>
            )}
          </GameContent>
        </GameContainer>
      </View>
    </ScreenWrapper>
  );
};

export default Game;