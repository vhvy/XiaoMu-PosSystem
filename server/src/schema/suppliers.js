import Joi from "@hapi/joi";

export const name = Joi.string().min(1).max(10);
const phone = Joi.string().min(5).max(13);
const description = Joi.string().min(1).max(100);

export const createSupplierSchema = Joi.object({
    name: name.required(),
    phone,
    description
});

export const updateSupplierSchema = Joi.object({
    name: name.required(),
    update_value: Joi.object({
        new_name: name,
        new_phone: phone,
        new_description: description
    }).or(
        "new_name",
        "new_phone",
        "new_description"
    ).required()
});

export const deleteSupplierSchema = Joi.object({
    name: name.required()
});