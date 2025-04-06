import { ApiServiceMock } from "./api.service.mock";
import { ProductsService } from "./products.service";

describe("ProductsService getProducts() method", () => {
    let api = ApiServiceMock;
    let apiSpy: jest.SpyInstance<Promise<IProduct[]>>;
    let productsService: IProductsService;

    beforeEach(() => {
        productsService = new ProductsService();
        apiSpy = jest.spyOn(api, "fetchData");
        apiSpy.mockClear();
    });

    /**
     * Calls getProducts() and checks a call was made to the API
     * and that the response contains results.
     * --- flow ---
     * getProducts() => 1 API call
     */
    test(`should call API and get products`, async () => {
        const res = await productsService.getProducts();
        expect(apiSpy).toHaveBeenCalled();
        expect(res.length).toBeGreaterThan(0);
    });

    /**
     * Performs the same getProducts() call multiple times
     * and checks that only one request was actually sent to the API.
     * --- flow ---
     * getProducts()*5 => 1 API call
     */
    test(`should throttle repeating requests until the API returns a result`, async () => {
        const results = await callServiceMultipleTimes(5);
        expect(apiSpy).toHaveBeenCalledTimes(1);
        expect(results[0]).toEqual(results[1]);
    });

    /**
     * Performs the same request multiple times. Once finished with the
     * first set of requests (and a result was returned), it does it again. Then it checks that only 2 calls were
     * made to the API.
     * --- flow ---
     * getProducts()*5, await response, getProducts()*5 => 2 API calls
     */
    test(`should send another request when called after the first one was resolved`, async () => {
        await callServiceMultipleTimes(5);
        callServiceMultipleTimes(5);
        expect(apiSpy).toHaveBeenCalledTimes(2);
    });

    /**
     * Calls getProducts() with a "category" parameter and checks
     * that the results are filtered to match the parameter value.
     * --- flow ---
     * getProducts('electronics'), await response => response data has only `electronics` category products
     */
    test(`should return only results that match the "category" query parameter`, async () => {
        const category = "electronics";
        const results = await productsService.getProducts(category);
        let isResultsCorrect = resultsMatchCategoryQuery(results, category);
        expect(isResultsCorrect).toBeTruthy();
    });

    /**
     * Executes the getProducts() call with 2 different "category" values
     * and then checks 2 calls were made to the API.
     * --- flow ---
     * getProducts('electronics'), getProducts('furniture') => 2 API calls
     */
    test(`should call API once per category query`, () => {
        const category1 = "electronics";
        const category2 = "furniture";
        productsService.getProducts(category1);
        productsService.getProducts(category2);
        expect(apiSpy).toHaveBeenCalledTimes(2);
    });

    /** ----------------------------------------- */
    /** ------------ Helper methods ------------- */
    /** ----------------------------------------- */

    /**
     * Takes a result array and matches each `result.category` to the `category` parameter.
     *
     * @param {IProduct[]} results
     * @param {string} category
     * @returns {boolean} `boolean` - true when every result matches and false when not
     */
    function resultsMatchCategoryQuery(results: IProduct[], category: string): boolean {
        return results.every(
            (x) => x.category.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Calls getProducts() multiple times according the the `repeat` parameter and passes the category to filter.
     * Returns a promise containing an array of result arrays -> IProduct[][].
     *
     * @param {number} repeat
     * @param {string} [category]
     * @returns `Promise<IProduct[][]>`
     */
    function callServiceMultipleTimes(
        repeat: number,
        category?: string
    ): Promise<IProduct[][]> {
        const arr: Promise<IProduct[]>[] = Array(repeat)
            .fill(0)
            .map(() => productsService.getProducts.bind(productsService)(category));
        return Promise.all(arr);
    }
});