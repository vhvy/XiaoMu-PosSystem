import Joi from "joi";
import { Page, PageSize } from "@/validator/common";

export const productListSchema = Joi.object({
    page: Page,
    limit: PageSize
});