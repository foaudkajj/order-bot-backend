import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSourceLoadOptionsBase, SortingInfo } from "src/panel/dtos/DevextremeQuery";
import { FindManyOptions, MoreThan } from "typeorm";

@Injectable()
export class DevextremeLoadOptionsService {
    constructor() {

    }


    GetFindOptionsFromQuery<T>(query: DataSourceLoadOptionsBase): FindManyOptions<T> {
        let findOptions: FindManyOptions<T> = {};
        if (query.take && query.skip) {
            findOptions.take = query.take;
            findOptions.skip = query.skip;
        }


        if(query.filter){
            const filter = JSON.parse(query.filter);
            switch (filter[1]) {
                case '>':
                    findOptions.where = {[filter[0]]: MoreThan(filter[2]) }
                    break;
            
                default:
                    break;
            }
        }

        
        const sortByFields = query.sort ? JSON.parse(query.sort.toString()) as SortingInfo[] : undefined
        if (sortByFields?.length > 0) {
            let sortFields = {};
            sortByFields.forEach(fe => {
                if (!fe.selector.includes('.')) {
                    sortFields[fe.selector] = fe.desc ? 'DESC' : 'ASC';
                }
            });
            findOptions.order = sortFields;
        }
        findOptions.select = query.select ? JSON.parse(query.select) as (keyof T)[] : undefined;

        return findOptions;
    }
}