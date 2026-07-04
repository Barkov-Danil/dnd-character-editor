import { useState, type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { COLORS, FONT } from '../theme';

export function DetailSheet({
  trigger,
  title,
  children,
}: {
  trigger: (open: () => void) => ReactNode;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {trigger(() => setOpen(true))}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.sheetBody} contentContainerStyle={{ paddingBottom: 24 }}>
              {children}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    width: 460,
    maxWidth: '92%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetTitle: {
    fontSize: FONT.size.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  sheetBody: { paddingHorizontal: 16, paddingVertical: 12 },
});

const labelStyles = StyleSheet.create({
  label: { color: COLORS.primary, fontSize: FONT.size.xs, fontWeight: 'bold', marginTop: 12, textTransform: 'uppercase' },
  value: { color: COLORS.text, fontSize: FONT.size.sm, marginTop: 2 },
  bullet: { color: COLORS.text, fontSize: FONT.size.sm, paddingVertical: 3 },
});

export const DetailLabel = ({ children }: { children: ReactNode }) => (
  <Text style={labelStyles.label}>{children}</Text>
);
export const DetailValue = ({ children }: { children: ReactNode }) => (
  <Text style={labelStyles.value}>{children}</Text>
);
export const DetailBullet = ({ children }: { children: ReactNode }) => (
  <Text style={labelStyles.bullet}>• {children}</Text>
);
