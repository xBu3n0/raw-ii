export default interface ApiResponse {
    status: string;
    data: any;
    error: string | null;
    errors: Record<string, string[]>;
    statusCode: number;
}
