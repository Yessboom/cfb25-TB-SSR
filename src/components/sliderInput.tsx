import { updatePlayerBasicInfo } from "~/lib/player";
import { createSignal, onMount } from "solid-js";

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
  const [isClient, setIsClient] = createSignal(false);
  
  onMount(() => {
    setIsClient(true);
  });

  return (
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-gray-700">{props.label}</span>
        <span class="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
          {props.formatter ? props.formatter(props.value) : props.value}
        </span>
      </div>
      
      <form action={updatePlayerBasicInfo} method="post" class="w-full">
        <input type="hidden" name="playerId" value={props.playerId} />
        <input type="hidden" name="field" value={props.field} />
        
        <div class="relative">
          <input
            type="range"
            name="value"
            min={props.min}
            max={props.max}
            step={props.step || 1}
            value={props.value}
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            onInput={isClient() ? (e) => {
              // Only add JavaScript behavior after hydration
              const form = e.currentTarget.closest('form') as HTMLFormElement;
              if (form) {
                clearTimeout((form as any).submitTimeout);
                (form as any).submitTimeout = setTimeout(() => form.submit(), 500);
              }
            } : undefined}
          />
        </div>
        
        {/* Manual submit button for no-JS fallback */}
        <noscript>
          <button 
            type="submit"
            class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Update
          </button>
        </noscript>
      </form>
    </div>
  );
}