import { ApiServiceMock } from "./api.service.mock"; // <-- I am here for a reason... USE ME!

export class ProductsService implements IProductsService {
    public getProducts(): Promise<IProduct[]> {
        throw Error("Not implemented");
    }
}
