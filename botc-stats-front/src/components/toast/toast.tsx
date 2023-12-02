import toast from "react-hot-toast";

export function toastPromise(promise: Promise<any>, loading: string) {
  toast.promise(promise, {
    loading,
    success: <b>Succès !</b>,
    error: (err) => <b>Erreur : {err.toString()}</b>,
  });
}
