declare module "@paystack/inline-js" {
  export default class Paystack {
    resumeTransaction(
      accessCode: string,
      callbacks?: {
        onSuccess?: () => void;
        onCancel?: () => void;
        onError?: (error: unknown) => void;
      },
    ): unknown;
  }
}
