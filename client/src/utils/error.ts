export const getValidationErrors = (err: any): string => {
    if (err instanceof Error) {
        return err.message;
    }

    return err?.message;
}