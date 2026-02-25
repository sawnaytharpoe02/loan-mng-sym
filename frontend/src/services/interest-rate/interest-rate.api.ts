import { api } from "@/lib/axios";
import type { InterestRateListResponse, InterestRateResponse, CreateInterestRateDTO } from "./interest-rate.types";

export const interestRateApi = {
    getAll: () =>
        api.get<InterestRateListResponse>("/interest-rates"),
    getActive: () =>
        api.get<InterestRateListResponse>("/interest-rates/active"),
    getById: (id: string) =>
        api.get<InterestRateResponse>(`/interest-rates/${id}`),
    create: (data: CreateInterestRateDTO) =>
        api.post<InterestRateResponse>("/interest-rates", data),
    update: (id: string, data: Partial<CreateInterestRateDTO>) =>
        api.put<InterestRateResponse>(`/interest-rates/${id}`, data),
    delete: (id: string) =>
        api.delete<InterestRateResponse>(`/interest-rates/${id}`),
};
