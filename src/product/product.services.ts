import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductService {
    private readonly externalUrl = process.env.PRODUCT_URL;
    constructor(private readonly prisma: PrismaService){
    }

    async fetchAndStoreProduct():Promise<string>{
        try {
            const request = await axios.get(this.externalUrl);
            const products:CreateProductDto[]=request.data; 
            
            await this.prisma.data.createMany({
                data:products.map((product=>({
                    title:product.title,
                    price:product.price,
                    description:product.description,
                    category:product.category,
                    image:product.image,
                    sold:product.sold,
                    dateOfSale:product.dateOfSale
                })))
            })


            return "Products successfully stored in database !"
        } catch (error) {
            throw new Error("Failed to fetch or Store Data")
        }
    }

    async getProducts(
        month: string | undefined, 
        search: string | undefined,
        page: number = 1, 
        perPage: number = 10,
      ) {
        const offset = (page - 1) * perPage;   
        const isSearchNumeric = search ? !isNaN(Number(search)) : false;
          const monthNumber = new Date(Date.parse(`${month} 1, 2000`)).getMonth()+1;
        if (month && (isNaN(monthNumber)|| monthNumber>12 || monthNumber===0)) {
          throw new Error(`Invalid month provided: ${month}`);
        }      
        return await this.prisma.data.findMany({
          where: {
            AND:[
                month?
                    {dateOfSale:{contains:`-0${monthNumber}-`}}
                :{},
                search?isSearchNumeric?{
                    price:{equals:parseFloat(search)}
                }:{
                   OR:[
                    {title:{contains:search}},
                    {description:{contains:search}}
                   ]
                }:{}
            ]
          },
          skip: offset,
          take: perPage,
        });
      }
      
      async getStatistics(month?:string){
        const monthNumber = new Date(Date.parse(`${month} 1, 2000`)).getMonth()+1;
        if (month && (isNaN(monthNumber)|| monthNumber>12 || monthNumber===0)) {
            throw new Error(`Invalid month provided: ${month}`);
          }   
        const monthFilter = monthNumber?{dateOfSale:{contains:`-0${monthNumber}-`}}:{}
        const [totalSale,soldItems,unsoldItems]=await Promise.all([
            this.prisma.data.aggregate({
                _sum:{price:true},where:{
                    ...monthFilter,sold:true
                }
            }),
            this.prisma.data.count({
                where:{
                    ...monthFilter,sold:true
                }
            }),
            this.prisma.data.count({
                where:{
                    ...monthFilter,
                    sold:false
                }
            })
        ])
        return {
            totalSale:totalSale._sum.price || 0,
            soldItems,
            unsoldItems
        }
      }


    async getBarChart(month?:string){
        const monthNumber = new Date(Date.parse(`${month} 1, 2000`)).getMonth()+1;
        if (month && (isNaN(monthNumber)|| monthNumber>12 || monthNumber===0)) {
            throw new Error(`Invalid month provided: ${month}`);
          }   
        const monthFilter = monthNumber?{dateOfSale:{contains:`-0${monthNumber}-`}}:{}
        const priceRanges = [
            { min: 0, max: 100, range: '0-100' },
            { min: 101, max: 200, range: '101-200' },
            { min: 201, max: 300, range: '201-300' },
            { min: 301, max: 400, range: '301-400' },
            { min: 401, max: 500, range: '401-500' },
            { min: 501, max: 600, range: '501-600' },
            { min: 601, max: 700, range: '601-700' },
            { min: 701, max: 800, range: '701-800' },
            { min: 801, max: 900, range: '801-900' },
            { min: 901, max: Infinity, range: '901-above' },
          ];
        
          const counts = await Promise.all(
            priceRanges.map(async (range) => {
              const count = await this.prisma.data.count({
                where: {
                  ...monthFilter,
                  price: {
                    gte: range.min,
                    lt: range.max === Infinity ? undefined : range.max,
                  },
                },
              });
              return { range: range.range, count };
            }),
          );
        
          return counts;
    }

    async getPieChart(month?:string){
        const monthNumber = new Date(Date.parse(`${month} 1, 2000`)).getMonth()+1;
        if (month && (isNaN(monthNumber)|| monthNumber>12 || monthNumber===0)) {
            throw new Error(`Invalid month provided: ${month}`);
          }   
        const monthFilter = monthNumber?{dateOfSale:{contains:`-0${monthNumber}-`}}:{}
        const categories = await this.prisma.data.groupBy({
            by:['category'],
            where:monthFilter,
            _count:{_all:true}
        });
        return categories.map(category=>({category:category.category,count:category._count._all}))
    }

    async getMasterData(month?:string,search?:string,page:number=1,perPage:number=10):Promise<any>{
        const [products,statistics,barChart,pieChart]=await Promise.all([
            this.getProducts(month,search,page,perPage),
            this.getStatistics(month),
            this.getBarChart(month),
            this.getPieChart(month),
        ]);

        return {
            products:{page,perPage,products},
            statistics,
            barChart,pieChart
        }
    }
}