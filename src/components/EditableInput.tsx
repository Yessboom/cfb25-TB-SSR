import { createSignal, createEffect, JSX, Show } from "solid-js";
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
  const [isEditing, setIsEditing] = createSignal(false);
  const [currentValue, setCurrentValue] = createSignal(String(props.value));
  
  const updatePlayer = useAction(props.updateAction);
  const submission = useSubmission(props.updateAction);

  // Update current value when props change
  createEffect(() => {
    setCurrentValue(String(props.value));
  });

  // Handle form submission with JavaScript enhancement
  const handleSubmit = async (e: Event) => {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Only prevent default if JavaScript is available
    if (typeof window !== 'undefined') {
      e.preventDefault();
      
      try {
        await updatePlayer(formData);
        setIsEditing(false);
      } catch (error) {
        console.error("Update failed:", error);
        setCurrentValue(String(props.value));
      }
    }
    // If no JavaScript, form will submit normally to server
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (typeof window !== 'undefined') {
      if (e.key === "Enter") {
        (e.target as HTMLElement).closest("form")?.requestSubmit();
      } else if (e.key === "Escape") {
        setCurrentValue(String(props.value));
        setIsEditing(false);
      }
    }
  };

  const handleBlur = (e: Event) => {
    if (typeof window !== 'undefined') {
      // Auto-submit on blur only if JavaScript is available
      const form = (e.target as HTMLElement).closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const displayValue = () => {
    return props.formatter ? props.formatter(props.value) : String(props.value);
  };

  const startEditing = () => {
    if (typeof window !== 'undefined') {
      setIsEditing(true);
    }
  };

  return (
    <div class={props.class || ""}>
      <Show when={isEditing()} fallback={
        <span
          onClick={startEditing}
          class={`cursor-pointer hover:bg-gray-100 rounded px-1 ${props.displayClass || ""}`}
          title="Click to edit"
        >
          {displayValue()}
        </span>
      }>
        <form 
          onSubmit={handleSubmit}
          method="post"
          action={props.updateAction}
          class="inline-block"
        >
          <input type="hidden" name="playerId" value={props.playerId} />
          <input type="hidden" name="field" value={props.field} />
          <input type="hidden" name="redirect" value={typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''} />
          <input type="hidden" name="redirect" value={typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''} />
          <input
            type={props.type || "text"}
            name="value"
            value={currentValue()}
            min={props.min}
            max={props.max}
            onInput={(e) => setCurrentValue(e.currentTarget.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={submission.pending}
            class={props.inputClass || "border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"}
            ref={(el) => {
              // Auto-focus and select text when editing starts (JS only)
              if (typeof window !== 'undefined') {
                setTimeout(() => {
                  el.focus();
                  el.select();
                }, 0);
              }
            }}
          />
          <button 
            type="submit" 
            class="ml-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Save
          </button>
          <Show when={typeof window !== 'undefined'}>
            <button 
              type="button"
              onClick={() => {
                setCurrentValue(String(props.value));
                setIsEditing(false);
              }}
              class="ml-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </Show>
        </form>
      </Show>
      
      {/* No-JS fallback: Always show edit form */}
      <noscript>
        <form 
          method="post"
          action={props.updateAction}
          class="inline-block ml-2"
        >
          <input type="hidden" name="playerId" value={props.playerId} />
          <input type="hidden" name="field" value={props.field} />
          <input
            type={props.type || "text"}
            name="value"
            value={props.value}
            min={props.min}
            max={props.max}
            class="border border-gray-300 rounded px-1 py-0 text-xs w-16"
          />
          <button 
            type="submit" 
            class="ml-1 px-1 py-0 bg-blue-500 text-white text-xs rounded"
          >
            ✓
          </button>
        </form>
      </noscript>
    </div>
  );
}