import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IconButton } from 'react-native-paper';
import { useCharacterStore } from './store/characterStore';

const MIP_ICON = require('../../assets/images/mip.png');
const BUTTER_ICON = require('../../assets/images/butter.png');
const LUPA_ICON = require('../../assets/images/lupa.png');

export default function HomeScreen() {
  const savedCharacters = useCharacterStore((s) => s.savedCharacters);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.topBar}>
        <Image source={BUTTER_ICON} style={styles.topIcon} resizeMode="contain" />
        <Image source={LUPA_ICON} style={styles.topIcon} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Все персонажи</Text>
      {savedCharacters.length === 0 ? (
        <View style={styles.centerWrap}>
          <Image source={MIP_ICON} style={styles.mipImg} resizeMode="contain" />
          <Text style={styles.subtitle}>
            {'Создайте своего персонажа\nили добавьте из библиотеки!'}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {savedCharacters.map((char) => (
            <TouchableOpacity
              key={char.id}
              style={styles.charCard}
              onPress={() => router.push(`/character/${char.id}` as `/character/${string}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.charName}>
                {char.name}
                {char.customRace ? ' ✦' : ''}
              </Text>
              <Text style={styles.charInfo}>
                {char.race} / {char.class} · Ур. {char.level}
              </Text>
              <Text style={styles.charSub}>{char.alignment} · {char.background}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => router.push('/wizard/step1-race' as `/wizard/step1-race`)}
          style={styles.mainBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.mainBtnText}>Создать персонажа</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/library')} style={styles.linkBtn}>
          <Text style={styles.linkText}>Импортировать из библиотеки</Text>
        </TouchableOpacity>
      </View>

      <IconButton
        icon="calculator-variant"
        mode="contained"
        size={28}
        iconColor="#FFFFFF"
        containerColor="#D85336"
        style={styles.calcFab}
        onPress={() => router.push('/calculator' as `/calculator`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  topBar: {
    height: 56, width: '100%', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', marginTop: 52,
  },
  topIcon: { width: 48, height: 48 },
  title: {
    marginTop: 8, paddingLeft: 16, paddingRight: 16,
    color: '#DBDBDB', fontSize: 28, fontFamily: 'PlayfairDisplay-Medium', textAlign: 'left',
  },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mipImg: { width: 208, height: 208, marginBottom: 24 },
  subtitle: {
    color: 'rgba(219, 219, 219, 0.7)', fontSize: 16,
    fontFamily: 'Spectral-Regular', textAlign: 'center', lineHeight: 22,
  },
  bottom: { alignItems: 'center', justifyContent: 'center', paddingBottom: 48, gap: 8 },
  linkBtn: { paddingVertical: 4 },
  linkText: { color: '#D85336', fontFamily: 'Spectral-Regular', fontSize: 14, textAlign: 'center' },
  mainBtn: {
    width: 312, height: 44, borderRadius: 14,
    backgroundColor: '#D85336', alignItems: 'center', justifyContent: 'center',
  },
  mainBtnText: { color: '#DBDBDB', fontFamily: 'Spectral-Medium', fontSize: 16 },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 10 },
  charCard: {
    backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  charName: { color: '#D85336', fontSize: 18, fontWeight: 'bold' },
  charInfo: { color: '#DBDBDB', fontSize: 14, marginTop: 4 },
  charSub: { color: 'rgba(219,219,219,0.6)', fontSize: 12, marginTop: 2 },

  calcFab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: '#D85336',
    borderRadius: 28,
  },
});
