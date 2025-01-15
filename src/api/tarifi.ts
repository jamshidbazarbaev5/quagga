import {useQuery} from "@tanstack/react-query";
import {api} from "./api.ts";
export const getTariffs = ()=>{
    return useQuery({
        queryKey:['tariffs'],
        queryFn:async()=>{
            const response = await api.get('/tariffs')
            return response.data
        }

    })
}