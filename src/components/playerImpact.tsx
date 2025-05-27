import { updatePlayerBasicInfo } from "~/lib/player";
import { createSignal, onMount } from "solid-js";

interface ImpactPlayerToggleProps {
  playerId: string;
  isImpactPlayer: boolean;
}

export default function ImpactPlayerToggle(props: ImpactPlayerToggleProps) {
  const [isClient, setIsClient] = createSignal(false);
  
  onMount(() => {
    setIsClient(true);
  });

  return (
    <form action={updatePlayerBasicInfo} method="post" class="inline-block">
      <input type="hidden" name="playerId" value={props.playerId} />
      <input type="hidden" name="field" value="impactPlayer" />
      <input type="hidden" name="value" value={props.isImpactPlayer ? "0" : "1"} />
      
      <button 
        type="submit"
        class={`impact-star p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-500 ${
          props.isImpactPlayer 
            ? "text-yellow-500 active" 
            : "text-gray-300 hover:text-gray-400"
        }`}
        title={props.isImpactPlayer ? "Remove impact player status" : "Mark as impact player"}
        onClick={isClient() ? (e) => {
          // Immediate visual feedback for better UX
          e.preventDefault();
          const form = e.currentTarget.closest('form') as HTMLFormElement;
          if (form) {
            form.submit();
          }
        } : undefined}
      >
        <svg 
          class="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    </form>
  );
}