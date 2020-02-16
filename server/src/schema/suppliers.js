import Joi from "@hapi/joi";

export const name = Joi.string().min(2).max(10).error(errors => {
    errors.forEach(err => {
        console.log(err)
        switch (err.code) {
            case "string.empty":
                err.message = "供应商名称不能为空!";
                break;
            case "string.min":
                err.message = `供应商名称需要大于或等于${err.local.limit}个字!`;
                break;
            case "string.max":
                err.message = `供应商名称长度需要小于或等于${err.local.limit}个字!`;
                break;
            default:
                break;
        }
    });
    return errors;
});
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