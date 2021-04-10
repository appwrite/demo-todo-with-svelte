import { update_keyed_each } from "svelte/internal";
// “The best thing about a boolean is even if you are wrong, you are only off by a bit.”
import { get, writable } from "svelte/store";
import { sdk, server } from "./appwrite";

const createTodos = () => {
  const { subscribe, update, set } = writable([]);

  return {
    subscribe,
    fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.collection);
      return set(response.documents);
    },
    addTodo: async (content) => {
      const permissions = [`user:${get(state).account.$id}`];
      const todo = await sdk.database.createDocument(
        server.collection,
        {
          content,
          isComplete: false,
        },
        permissions,
        permissions
      );

      return update((n) => [todo, ...n]);
    },
    removeTodo: async (todo) => {
      await sdk.database.deleteDocument(server.collection, todo.$id);
      return update((n) => n.filter((t) => t.$id !== todo.$id));
    },
    updateTodo: async (todo) => {
      const permissions = [`user:${get(state).account.$id}`];
      await sdk.database.updateDocument(
        server.collection,
        todo.$id,
        todo,
        permissions,
        permissions
      );
      return update((n) => {
        n[n.findIndex((t) => t.$id === todo.$id)] = todo;
        return n;
      });
    },
  };
};

const createState = () => {
  const { subscribe, set, update } = writable({
    account: null,
    alert: null,
  });

  return {
    subscribe,
    signup: async (email, password, name) => {
      return await sdk.account.create(email, password, name);
    },
    login: async (email, password) => {
      await sdk.account.createSession(email, password);
      const user = await sdk.account.get();
      state.init(user);
    },
    logout: async () => {
      await sdk.account.deleteSession("current");
    },
    alert: async (alert) =>
      update((n) => {
        n.alert = alert;
        return n;
      }),
    init: async (account = null) => {
      return set({ account, alert: null });
    },
  };
};

export const todos = createTodos();
export const state = createState();
