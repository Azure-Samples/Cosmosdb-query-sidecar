export interface Address {
    id: string;
    street: string;
    city: string;
    state: string; // GetByState will fail
    zipCode: string; // PartitionKey
}