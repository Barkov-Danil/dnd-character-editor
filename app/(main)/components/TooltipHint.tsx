import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { COLORS, FONT, SPACING } from '../theme';

export function TooltipHint({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <IconButton
        icon="help-circle-outline"
        size={16}
        iconColor={COLORS.textSecondary}
        onPress={() => setVisible(true)}
        style={styles.iconButton}
      />
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.popup}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
    width: 24,
    height: 24,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  popup: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    maxWidth: 320,
  },
  text: {
    fontSize: FONT.size.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
});
