import { updatePlayerBasicInfo } from "~/lib/player";
import { createSignal, onMount } from "solid-js";
import { useAction, useSubmission, useLocation } from "@solidjs/router";
import { Show } from "solid-js";

interface SliderInputProps {
  value: number;
  playerId: string;
  field: string;
  min: number;
  max: number;
  step?: number;
  formatter?: (value: number) => string;
  label: string;
}

export default function SliderInput(props: SliderInputProps) {
  const [currentValue, setCurrentValue] = createSignal(props.value);
  const updateAction = useAction(updatePlayerBasicInfo);
  const updating = useSubmission(updatePlayerBasicInfo);
  const location = useLocation();
  const [showFallbackSubmit, setShowFallbackSubmit] = createSignal(true);

  let submitTimeoutId: NodeJS.Timeout | undefined;

  onMount(() => {
    setShowFallbackSubmit(false);
  });

  const handleSliderChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    const newValue = parseInt(target.value);
    setCurrentValue(newValue);

    if (submitTimeoutId) clearTimeout(submitTimeoutId);

    submitTimeoutId = setTimeout(async () => {
      try {
        const formData = new FormData();
        formData.append("playerId", props.playerId);
        formData.append("field", props.field);
        formData.append("value", newValue.toString());
        await updateAction(formData);
      } catch (error) {
        console.error("Failed to update player:", error);
        setCurrentValue(props.value);
      }
    }, 750);
  };

  return (
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-gray-700">{props.label}</span>
        <span class="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
          {props.formatter ? props.formatter(currentValue()) : currentValue()}
          {updating.pending && (
            <span class="ml-2 text-blue-600 text-xs">Saving...</span>
          )}
        </span>
      </div>

      {/* Single form containing both slider and submit button */}
      <form action={updatePlayerBasicInfo} method="post" class="space-y-2">
        <input type="hidden" name="playerId" value={props.playerId} />
        <input type="hidden" name="field" value={props.field} />
        
        <div class="relative">
          <input
            type="range"
            name="value"
            min={props.min}
            max={props.max}
            step={props.step || 1}
            value={currentValue()}
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            onInput={handleSliderChange}
            disabled={updating.pending}
          />
        </div>

        <Show when={showFallbackSubmit()}>
          <button
            type="submit"
            class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Update {props.label}
          </button>
        </Show>
      </form>
    </div>
  );
}
