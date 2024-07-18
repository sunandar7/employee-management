const db = require('../models');

const paginate = (page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return { offset, limit };
};

const getPaginatedData = async (model, page, pageSize, filter = {}, sort = []) => {
    const { offset, limit } = paginate(page, pageSize);

    const { count, rows } = await model.findAndCountAll({
        where: filter,
        order: sort,
        offset: offset,
        limit: limit,
        attributes: { exclude: ['position_id','department_id']},
        include:  [
            {
                model: db.Position,
                attributes: ['id', 'position_name']
            },
            {
                model: db.Department,
                attributes: ['id', 'department_name']
            }
        ]
    });

    return {
        totalRecords: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
        data: rows
    };
};

module.exports = {
    paginate,
    getPaginatedData
};
