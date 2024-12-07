import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { filters } from "src/utils/filter";

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
            console.log("ERROR: ",error)
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
        const {monthFilter,searchFilter}=filters(month,search)
                          
        return await this.prisma.data.findMany({
          where: {
            AND:[
                monthFilter,
                searchFilter
            ]
          },
          skip: offset,
          take: perPage,
        });
      }
      
      async getStatistics(month?: string, search?: string, page: number = 1) {
        const offset = (page - 1) * 10;
        const { monthFilter, searchFilter } = filters(month, search);
      
        const data = await this.prisma.data.findMany({
          where: {
            AND: [monthFilter, searchFilter],
          },
          skip: offset,
          take: 10,
        });
      
        const totalSale = data.reduce((sum, item) => (item.sold ? sum + item.price : sum), 0);
        const soldItems = data.filter((item) => item.sold).length;
        const unsoldItems = data.filter((item) => !item.sold).length;
      
        return {
          totalSale,
          soldItems,
          unsoldItems,
        };
      }
      


    async getBarChart(month?:string,search?:string,page:number=1){
        const offset = (page - 1) * 10;   

        const {monthFilter,searchFilter}=filters(month,search)
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
        
          const data =  await this.prisma.data.findMany({
                where: {
                  AND:[
                    monthFilter,
                    searchFilter
                ],
                },
                skip:offset,
                take:10
                
              });

              const counts = priceRanges.map((range) => {
                const count = data.filter(
                  (item) =>
                    item.price >= range.min && (range.max === Infinity || item.price < range.max)
                ).length;
            
                return { range: range.range, count };
              });
            

              return counts
          
        
    }

    async getPieChart(month?: string, search?: string, page: number = 1) {
      const offset = (page - 1) * 10;
    
      const { monthFilter, searchFilter } = filters(month, search);
    
      const data = await this.prisma.data.findMany({
        where: {
          AND: [monthFilter, searchFilter],
        },
        skip: offset,
        take: 10,
      });
    
      const categoryCounts = data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = 0;
        }
        acc[item.category]++;
        return acc;
      }, {} as Record<string, number>);
    
      return Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
      }));
    }    

    async getMasterData(month?:string,search?:string,page:number=1,perPage:number=10):Promise<any>{
        const [products,statistics,barChart,pieChart]=await Promise.all([
            this.getProducts(month,search,page,perPage),
            this.getStatistics(month,search,page),
            this.getBarChart(month,search,page),
            this.getPieChart(month,search,page),
        ]);

        return {
            products:{page,perPage,products},
            statistics,
            barChart,pieChart
        }
    }
}