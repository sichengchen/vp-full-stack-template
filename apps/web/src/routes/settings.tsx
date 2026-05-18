import { Badge } from "@template/ui/components/badge";
import { Button } from "@template/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@template/ui/components/card";
import { cn } from "@template/ui/lib/utils";
import { usePreferencesStore } from "../stores/preferences";

const densityOptions = ["comfortable", "compact"] as const;

export function SettingsPage() {
  const density = usePreferencesStore((state) => state.density);
  const setDensity = usePreferencesStore((state) => state.setDensity);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="outline">Zustand example</Badge>
        <h1 className="text-3xl font-semibold tracking-normal">Preferences</h1>
        <p className="text-muted-foreground max-w-2xl">
          Zustand stores lightweight client state separately from server data cached by TanStack
          Query.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todo density</CardTitle>
          <CardDescription>Stored locally with Zustand persist middleware.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="inline-flex rounded-md border p-1">
            {densityOptions.map((option) => (
              <Button
                key={option}
                variant="ghost"
                size="sm"
                className={cn(
                  "capitalize",
                  density === option && "bg-accent text-accent-foreground",
                )}
                onClick={() => setDensity(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
