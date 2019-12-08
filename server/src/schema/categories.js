import Joi from "@hapi/joi";

export const categoryName = Joi.string().min(1).max(10);
export const categoryNameReq = categoryName.required();

export const createCategorySchema = Joi.object({
    name: categoryNameReq,
    parent_name: categoryName.invalid(Joi.ref("name"))
});

export const updateCategoryNameSchema = Joi.object({
    old_name: categoryNameReq,
    new_name: categoryName.invalid(Joi.ref("old_name")).required()
});

export const updateCategoryParentSchema = Joi.object({
    name: categoryNameReq,
    parent_name: categoryName.invalid(Joi.ref("name")).required()
});

export const deleteCategorySchema = Joi.object({
    name: categoryNameReq
});