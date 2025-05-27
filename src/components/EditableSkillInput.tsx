// components/EditableSkillInput.tsx
import { createSignal, createEffect } from "solid-js";
import { useAction } from "@solidjs/router";

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
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  
  const updatePlayerSkill = useAction(props.updateAction);

  // Update current value when props change
  createEffect(() => {
    setCurrentValue(props.value);
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("playerId", props.playerId);
    formData.append("skillName", props.skillName);
    formData.append("skillValue", String(currentValue()));
    
    try {
      await updatePlayerSkill(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Skill update failed:", error);
      // Revert to original value on error
      setCurrentValue(props.value);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.target as HTMLElement).closest("form")?.requestSubmit();
    } else if (e.key === "Escape") {
      setCurrentValue(props.value);
      setIsEditing(false);
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
          <form onSubmit={handleSubmit} class="inline-block">
            <input
              type="number"
              min="0"
              max="99"
              value={currentValue()}
              onInput={(e) => setCurrentValue(parseInt(e.currentTarget.value) || 0)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting()}
              class="w-16 text-lg font-bold text-center border border-gray-300 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ref={(el) => {
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
            class={`text-lg font-bold cursor-pointer hover:bg-gray-200 rounded px-1 ${getSkillColor(currentValue())}`}
            title="Click to edit"
          >
            {currentValue()}
          </span>
        )}
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class={`h-2 rounded-full transition-all duration-300 ${getBarColor(currentValue())}`}
          style={{ width: `${Math.min(currentValue(), 100)}%` }}
        />
      </div>
    </div>
  );
}