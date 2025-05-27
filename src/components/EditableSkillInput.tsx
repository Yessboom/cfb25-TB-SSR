import { createSignal, createEffect } from "solid-js";
import { useSubmission } from "@solidjs/router";
import { Show } from "solid-js";

interface EditableSkillInputProps {
  value: number;
  playerId: string;
  skillName: string;
  updateAction: any;
  formatSkillName: (name: string) => string;
}

export default function EditableSkillInput(props: EditableSkillInputProps) {
  const [currentValue, setCurrentValue] = createSignal(props.value);
  const submission = useSubmission(props.updateAction);
  
  let debounceTimer: number | undefined;

  // Update current value when props change
  createEffect(() => {
    setCurrentValue(props.value);
  });

  const handleInput = (e: Event) => {
    const newValue = parseInt((e.target as HTMLInputElement).value) || 0;
    setCurrentValue(newValue);

    // Auto-submit after delay (only with JS)
    if (typeof window !== 'undefined') {
      if (debounceTimer) clearTimeout(debounceTimer);
      
      debounceTimer = window.setTimeout(() => {
        if (currentValue() !== props.value) {
          const form = (e.target as HTMLElement).closest("form");
          form?.requestSubmit();
        }
      }, 1000);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (typeof window !== 'undefined') {
      if (e.key === "Enter") {
        e.preventDefault();
        (e.target as HTMLElement).closest("form")?.requestSubmit();
      } else if (e.key === "Escape") {
        setCurrentValue(props.value);
        (e.target as HTMLInputElement).blur();
      }
    }
  };

  const getSkillColor = (value: number) => {
    if (value >= 85) return "text-green-600";
    if (value >= 75) return "text-blue-600";
    if (value >= 65) return "text-yellow-600";
    return "text-red-600";
  };

  const getBarColor = (value: number) => {
    if (value >= 85) return "bg-green-500";
    if (value >= 75) return "bg-blue-500";
    if (value >= 65) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div class="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700">
          {props.formatSkillName(props.skillName)}
        </span>
        
        {/* Single form that works with and without JS */}
        <form
          method="post"
          action={props.updateAction}
          class="inline-flex items-center gap-2"
        >
          <input type="hidden" name="playerId" value={props.playerId} />
          <input type="hidden" name="skillName" value={props.skillName} />
          <input type="hidden" name="redirect" value="" />
          
          <input
            type="number"
            name="skillValue"
            min="0"
            max="99"
            value={currentValue()}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            disabled={submission.pending}
            class={`w-16 text-lg font-bold text-center border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${getSkillColor(currentValue())}`}
            title="Enter value and press Enter or Tab to save"
          />
          
          {/* Manual submit button for no-JS and explicit saves */}
          <noscript>
          <button
            type="submit"
            disabled={submission.pending}
            class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {submission.pending ? "..." : "Save"}
          </button>
          </noscript>
          
          {/* Show current value in monospace font */}
          
          {/* Status indicators */}
          <Show when={submission.pending}>
            <span class="text-blue-600 text-xs">💾</span>
          </Show>
          <Show when={submission.result instanceof Error}>
            <span class="text-red-600 text-xs" title={(submission.result as Error).message}>❌</span>
          </Show>
        </form>
      </div>

      {/* Progress bar */}
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class={`h-2 rounded-full transition-all duration-300 ${getBarColor(currentValue())}`}
          style={{ width: `${Math.min(currentValue(), 100)}%` }}
        />
      </div>
    </div>
  );
}
