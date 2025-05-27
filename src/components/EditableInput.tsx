// components/EditableInput.tsx
import { createSignal, createEffect, JSX } from "solid-js";
import { useAction } from "@solidjs/router";

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
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  
  const updatePlayer = useAction(props.updateAction);

  // Update current value when props change
  createEffect(() => {
    setCurrentValue(String(props.value));
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("playerId", props.playerId);
    formData.append("field", props.field);
    formData.append("value", currentValue());
    
    try {
      await updatePlayer(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      // Revert to original value on error
      setCurrentValue(String(props.value));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.target as HTMLElement).closest("form")?.requestSubmit();
    } else if (e.key === "Escape") {
      setCurrentValue(String(props.value));
      setIsEditing(false);
    }
  };

  const displayValue = () => {
    return props.formatter ? props.formatter(props.value) : String(props.value);
  };

  return (
    <div class={props.class || ""}>
      {isEditing() ? (
        <form onSubmit={handleSubmit} class="inline-block">
          <input
            type={props.type || "text"}
            value={currentValue()}
            min={props.min}
            max={props.max}
            onInput={(e) => setCurrentValue(e.currentTarget.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting()}
            class={props.inputClass || "border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"}
            ref={(el) => {
              // Auto-focus and select text when editing starts
              setTimeout(() => {
                el.focus();
                el.select();
              }, 0);
            }}
          />
          <noscript>
            <button type="submit" class="ml-1 px-2 py-1 bg-blue-500 text-white text-xs rounded">
              Save
            </button>
          </noscript>
        </form>
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          class={`cursor-pointer hover:bg-gray-100 rounded px-1 ${props.displayClass || ""}`}
          title="Click to edit"
        >
          {displayValue()}
        </span>
      )}
    </div>
  );
}