import { createSignal, createEffect, onCleanup } from "solid-js";
import { useAction, useSubmission } from "@solidjs/router";

interface EditableSkillInputProps {
  value: number;
  playerId: string;
  skillName: string;
  updateAction: any;
  formatSkillName: (name: string) => string;
}

export default function EditableSkillInput(props: EditableSkillInputProps) {
  const [isEditing, setIsEditing] = createSignal(false);
  const [currentValue, setCurrentValue] = createSignal(props.value);

  const updatePlayerSkill = useAction(props.updateAction);
  const submission = useSubmission(props.updateAction);
  let debounceTimer: number | undefined;

  // Update current value when props change
  createEffect(() => {
    setCurrentValue(props.value);
  });

  const handleSubmit = async (e: Event) => {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Only prevent default if JavaScript is available
    if (typeof window !== 'undefined') {
      e.preventDefault();

      try {
        await updatePlayerSkill(formData);
        setIsEditing(false);
      } catch (error) {
        console.error("Skill update failed:", error);
        setCurrentValue(props.value);
      }
    }
    // If no JavaScript, form will submit normally to server
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (typeof window !== 'undefined') {
      if (e.key === "Enter") {
        (e.target as HTMLElement).closest("form")?.requestSubmit();
      } else if (e.key === "Escape") {
        setCurrentValue(props.value);
        setIsEditing(false);
      }
    }
  };

  const handleBlur = (e: Event) => {
    if (typeof window !== "undefined") {
      const form = (e.target as HTMLElement).closest("form");
      if (form) {
        // Delay submission to allow click events (like "Cancel") to process first
        setTimeout(() => {
          if (document.activeElement && !form.contains(document.activeElement)) {
            form.requestSubmit();
          }
        }, 100);
      }
    }
  };

  const handleInput = (e: Event) => {
    const newValue = parseInt((e.target as HTMLInputElement).value) || 0;
    setCurrentValue(newValue);

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = window.setTimeout(() => {
      const form = (e.target as HTMLElement).closest("form");
      if (form && currentValue() !== props.value) {
        form.requestSubmit();
      }
    }, 1000); // Submit 1s after user stops typing
  };

  const startEditing = () => {
    if (typeof window !== 'undefined') {
      setIsEditing(true);
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
        {isEditing() ? (
          <form
            onSubmit={handleSubmit}
            method="post"
            action={props.updateAction}
            class="inline-block"
          >
            <input type="hidden" name="playerId" value={props.playerId} />
            <input type="hidden" name="skillName" value={props.skillName} />
            <input type="hidden" name="redirect" value={typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''} />
            <input
              type="number"
              name="skillValue"
              min="0"
              max="99"
              value={currentValue()}
              onInput={handleInput}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={submission.pending}
              class="w-16 text-lg font-bold text-center border border-gray-300 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ref={(el) => {
                if (typeof window !== 'undefined') {
                  setTimeout(() => {
                    el.focus();
                    el.select();
                  }, 0);
                }
              }}
            />
            {typeof window !== 'undefined' && (
              <button
                type="button"
                onClick={() => {
                  setCurrentValue(props.value);
                  setIsEditing(false);
                }}
                class="ml-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </form>
        ) : (
          <span
            onClick={startEditing}
            class={`text-lg font-bold cursor-pointer hover:bg-gray-200 rounded px-1 ${getSkillColor(currentValue())}`}
            title="Click to edit"
          >
            {currentValue()}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class={`h-2 rounded-full transition-all duration-300 ${getBarColor(currentValue())}`}
          style={{ width: `${Math.min(currentValue(), 100)}%` }}
        />
      </div>

      {/* No-JS fallback: Always show edit form with proper event handling */}
<noscript
  innerHTML={`
    <div class="mt-2">
      <form method="post" action="${props.updateAction}" class="flex items-center gap-2">
        <input type="hidden" name="playerId" value="${props.playerId}" />
        <input type="hidden" name="skillName" value="${props.skillName}" />
        <input type="hidden" name="redirect"   value="" />
        <input
          type="number"
          name="skillValue"
          value="${props.value}"
          min="0"
          max="99"
          class="w-16 text-sm text-center border rounded px-1 py-1"
          title="Enter to submit"
          oninput="this.form.submit()"
        />
      </form>
    </div>
  `}
/>
    </div>
  );
}
