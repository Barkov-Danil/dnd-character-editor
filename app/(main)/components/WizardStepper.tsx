import { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SPACING } from '../theme';

export function WizardStepper({ currentStep, steps }: { currentStep: number; steps: string[] }) {
  return (
    <View style={styles.container}>
      {steps.map((label, index) => {
        const done = index < currentStep;
        const active = index === currentStep;
        return (
          <Fragment key={label}>
            <View style={styles.stepContainer}>
              <View style={[
                styles.stepCircle,
                done && styles.stepDone,
                active && styles.stepActive,
              ]}>
                <Text style={[styles.stepText, (done || active) && styles.stepTextOn]}>
                  {done ? '✓' : index + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, (done || active) && styles.stepLabelOn]}>
                {label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[styles.connector, done && styles.connectorDone]} />
            )}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  stepContainer: {
    alignItems: 'center',
    minWidth: 50,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepText: {
    fontSize: FONT.size.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stepTextOn: {
    color: COLORS.background,
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
    maxWidth: 60,
    textAlign: 'center',
  },
  stepLabelOn: {
    color: COLORS.text,
    fontWeight: '600',
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  connectorDone: {
    backgroundColor: COLORS.success,
  },
});
