import { Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "./product.services";
import { GetTransactionsDto } from "./dto/get-transactions.dto";

@Controller("product")
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @Get('initialize-database')
    async initializeDatabase():Promise<string>{
        return await this.productService.fetchAndStoreProduct();
    }

    @Get('products')
    async getProducts(@Query() query:GetTransactionsDto){
        const {month,search,page=1,perPage=10}=query;
        return this.productService.getProducts(month,search,Number(page),Number(perPage));
    }
    @Get('statistics')
    async getStatistics(@Query() query:{month?:string,search?:string,page?:number}){
        return this.productService.getStatistics(query.month)
    }

    @Get('barChart')
    async getBarChart(@Query() query:{month?:string,search?:string,page?:number}){
        return this.productService.getBarChart(query.month,query.search,query.page)
    }
    @Get('pieChart')
    async getPieChart(@Query() query:{month?:string,search?:string,page?:number}){
        return this.productService.getPieChart(query.month)
    }
    @Get('master-data')
    async getMasterData(@Query() query:GetTransactionsDto){
        const {month,search,page=1,perPage=10}=query;
        return this.productService.getMasterData(month,search,Number(page),Number(perPage));
    }

}