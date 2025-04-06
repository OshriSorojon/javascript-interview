interface IProduct {
    id: number;
    name: string;
    category: string;
    price: number;
}

interface IApiService {
    fetchData(): Promise<IProduct[]>;
}

interface IProductsService {
    getProducts(category?: string): Promise<IProduct[]>;
}