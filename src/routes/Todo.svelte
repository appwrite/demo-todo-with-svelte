<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  import { state, todos } from "../store";

  import Item from "../lib/Item.svelte";

  let value = "";

  const addTodo = () => {
    todos.addTodo(value);
    value = "";
  };

  const logout = async () => {
    try {
      await state.logout();
    } catch (error) {
      state.alert({ color: "red", message: error.message });
    } finally {
      state.init(null);
      push("/");
    }
  };

  onMount(todos.fetch);
</script>

<section
  class="container h-screen max-h-screen px-3 max-w-xl mx-auto flex flex-col"
>
  <div class="my-auto p-16 rounded-lg text-center">
    <div class="font-bold text-3xl md:text-5xl lg:text-6xl">
      📝 <br />
      &nbsp; toTooooDoooos
    </div>

    <form on:submit|preventDefault={addTodo}>
      <input
        type="text"
        class="w-full my-8 px-6 py-4 text-xl rounded-lg border-0 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md"
        placeholder="🤔   What to do today?"
        bind:value
      />
    </form>

    <ul>
      {#each $todos as todo}
        <Item {todo} />
      {/each}
    </ul>
  </div>
</section>

<section class="absolute bottom-0 right-0 py-3 px-6 mr-8 mb-8">
  <button
    on:click={logout}
    class="mx-auto mt-4 py-3 px-12 font-semibold text-md rounded-lg shadow-md bg-white text-gray-900 border border-gray-900 hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
  >
    Logout 👋
  </button>
</section>
