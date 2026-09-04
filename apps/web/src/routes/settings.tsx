import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { VStack } from "@astryxdesign/core/Stack";
import { Heading } from "@astryxdesign/core/Text";
import { usePreferencesStore } from "../stores/preferences";

const densityOptions = ["comfortable", "compact"] as const;

export function SettingsPage() {
  const density = usePreferencesStore((state) => state.density);
  const setDensity = usePreferencesStore((state) => state.setDensity);

  return (
    <VStack as="section" gap={6} hAlign="start">
      <Heading level={1}>Settings</Heading>
      <VStack gap={3} hAlign="start">
        <Heading level={2}>Todo density</Heading>
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
    </VStack>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
