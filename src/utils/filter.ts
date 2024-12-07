export const filters = (month?:string,search?:string)=>{
    const isSearchNumeric = search ? !isNaN(Number(search)) : false;
          const monthNumber = new Date(Date.parse(`${month} 1, 2000`)).getMonth()+1;
          const monthFilter = monthNumber?{dateOfSale:{contains:`${monthNumber<10?`-0${monthNumber}-`:`-${monthNumber}-`}`}}:{}
          const searchFilter= search?isSearchNumeric?{
                              price:{equals:parseFloat(search)}
                              }:{
                                OR:[
                                  {title:{contains:search}},
                                  {description:{contains:search}}
                                ]
                              }:{};
                              return {monthFilter,searchFilter}
}