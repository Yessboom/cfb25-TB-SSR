import { createSignal, createEffect, Show } from "solid-js";
import { useAction, useSubmission } from "@solidjs/router";

interface EditableInputProps {
  value: string | number;
  playerId: string;
  field: string;
  type?: "text" | "number";
  min?: number;
  max?: number;
  updateAction: any;
  class?: string;
  inputClass?: string;
  displayClass?: string;
  formatter?: (value: string | number) => string;
}

export default function EditableInput(props: EditableInputProps) {
  const [currentValue, setCurrentValue] = createSignal(String(props.value));
  
  const updatePlayer = useAction(props.updateAction);
  const submission = useSubmission(props.updateAction);
  
  let debounceTimer: number | undefined;

  // Update current value when props change
  createEffect(() => {
    setCurrentValue(String(props.value));
  });

  const handleInput = (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;
    setCurrentValue(newValue);

    // Auto-submit after delay (only with JS)
    if (typeof window !== 'undefined') {
      if (debounceTimer) clearTimeout(debounceTimer);
      
      debounceTimer = window.setTimeout(() => {
        if (currentValue() !== String(props.value)) {
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
        setCurrentValue(String(props.value));
        (e.target as HTMLInputElement).blur();
      }
    }
  };

  const handleSubmit = async (e: Event) => {
    // Only prevent default if JavaScript is available
    if (typeof window !== 'undefined') {
      e.preventDefault();
      
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      try {
        await updatePlayer(formData);
      } catch (error) {
        console.error("Update failed:", error);
        setCurrentValue(String(props.value));
      }
    }
    // If no JavaScript, form will submit normally to server
  };

  return (
    <div class={props.class || ""}>
      <form 
        onSubmit={handleSubmit}
        method="post"
        action={props.updateAction}
        class="inline-flex items-center gap-1"
      >
        <input type="hidden" name="playerId" value={props.playerId} />
        <input type="hidden" name="field" value={props.field} />
        <input type="hidden" name="redirect" value={typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''} />
        
        <input
          type={props.type || "text"}
          name="value"
          value={currentValue()}
          min={props.min}
          max={props.max}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          disabled={submission.pending}
          class={props.inputClass || `border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${props.displayClass || ""}`}
          title="Enter value and press Enter to save"
        />
        
        {/* Save button only visible when JavaScript is disabled */}
        <noscript>
          <button 
            type="submit" 
            class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Save
          </button>
        </noscript>
        
        {/* Status indicators for JavaScript users */}
        <Show when={submission.pending}>
          <span class="text-blue-600 text-xs">💾</span>
        </Show>
        <Show when={submission.result instanceof Error}>
          <span class="text-red-600 text-xs" title={(submission.result as Error).message}>❌</span>
        </Show>
      </form>
    </div>
  );
}