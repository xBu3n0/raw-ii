export default interface ApiResponse<T> {
    status: string;
    data: T;
    error: string | null;
    errors: Record<string, string[]>;
    statusCode: number;
}
