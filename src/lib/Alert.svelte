<script lang="ts">
    import { state } from "../store";
</script>

{#if $state.alert}
    <div
        class={`bg-${$state.alert.color}-500 text-white px-6 py-4 border-0 rounded absolute right-0 mt-10 mr-10`}
    >
        <span class="text-xl inline-block mr-5 align-middle">
            <i class="fas fa-bell" />
        </span>
        <span class="inline-block align-middle font-semibold mr-8">
            {$state.alert.message}
        </span>
        <button
            class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
        >
            <span on:click={() => state.alert(null)}>×</span>
        </button>
    </div>
{/if}
