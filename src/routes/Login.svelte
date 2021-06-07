<script lang="ts">
    import { push } from "svelte-spa-router";

    import { state } from "../store";

    let email: string,
        password: string = "";

    const login = async () => {
        if (!checkForm) {
            return;
        }
        try {
            await state.login(email, password);
            push("/todos");
        } catch (error) {
            state.alert({ color: "red", message: error.message });
        }
    };

    $: checkForm = email !== "" && password !== "";
</script>

<section class="container h-screen mx-auto flex">
    <div class="flex-grow flex flex-col max-w-xl justify-center p-6">
        <h1 class="text-6xl font-bold">Login</h1>
        <p class="mt-6">
            Don't have an account ?
            <span class="cursor-pointer underline">
                <a href="/#/signup"> Sign Up </a>
            </span>
        </p>
        <form on:submit|preventDefault={login}>
            <label class="block mt-6" for="email"> Email</label>
            <input
                id="email"
                class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                type="email"
                bind:value={email}
            />
            <label class="block mt-6" for="password"> Password</label>
            <input
                id="password"
                class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                type="password"
                bind:value={password}
            />

            <div class="mt-6">
                <button
                    disabled={!checkForm}
                    type="submit"
                    class="mx-auto mt-4 py-4 px-16 font-semibold rounded-lg shadow-md bg-gray-900 text-white border hover:border-gray-900 hover:text-gray-900 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Login
                </button>
            </div>
        </form>
    </div>
</section>
