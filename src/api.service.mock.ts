export const ApiServiceMock = {
    fetchData: jest.fn().mockResolvedValue([
        { id: 1, name: "Laptop", category: "electronics", price: 899 },
        { id: 2, name: "Smartphone", category: "electronics", price: 699 },
        { id: 3, name: "Coffee Table", category: "furniture", price: 199 },
        { id: 4, name: "Desk Lamp", category: "lighting", price: 59 },
        { id: 5, name: "Office Chair", category: "furniture", price: 159 }
    ])
};