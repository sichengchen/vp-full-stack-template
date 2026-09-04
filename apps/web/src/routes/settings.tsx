import { Section } from "@astryxdesign/core/Section";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { VStack } from "@astryxdesign/core/Stack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { usePreferencesStore } from "../stores/preferences";

const densityOptions = ["comfortable", "compact"] as const;

export function SettingsPage() {
  const density = usePreferencesStore((state) => state.density);
  const setDensity = usePreferencesStore((state) => state.setDensity);

  return (
    <VStack as="section" gap={6}>
      <VStack gap={2} hAlign="start">
        <Text color="secondary" type="supporting">
          Zustand example
        </Text>
        <Heading level={1}>Preferences</Heading>
        <Text as="p" color="secondary">
          Zustand stores lightweight client state separately from server data cached by TanStack
          Query.
        </Text>
      </VStack>

      <Section padding={6}>
        <VStack gap={4} hAlign="start">
          <VStack gap={1}>
            <Heading level={2}>Todo density</Heading>
            <Text color="secondary">Stored locally with Zustand persist middleware.</Text>
          </VStack>
          <SegmentedControl
            label="Todo density"
            onChange={(value) => setDensity(value as (typeof densityOptions)[number])}
            value={density}
          >
            {densityOptions.map((option) => (
              <SegmentedControlItem key={option} label={capitalize(option)} value={option} />
            ))}
          </SegmentedControl>
        </VStack>
      </Section>
    </VStack>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
