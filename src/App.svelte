<script lang="ts">
  import { onMount } from "svelte";

  import Router, { push } from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";
  import { sdk } from "./appwrite";
  import Alert from "./lib/Alert.svelte";
  import Landing from "./routes/Landing.svelte";

  import Login from "./routes/Login.svelte";
  import SignUp from "./routes/SignUp.svelte";
  import Todo from "./routes/Todo.svelte";
  import { state } from "./store";

  const routes = {
    "/": Landing,
    "/login": Login,
    "/signup": SignUp,
    "/todos": wrap({
      component: Todo,
      conditions: [() => !!$state.account],
    }),
    "*": Landing,
  };

  onMount(async () => {
    try {
      const account = await sdk.account.get();
      state.init(account);
    } catch (error) {
      state.init(null);
    } finally {
      if ($state.account) {
        push("/todos");
      }
    }
  });
</script>

<Alert />
<Router {routes} on:conditionsFailed={() => push('/')} />
