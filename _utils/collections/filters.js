const {findByInputPath} = require('./memo');
const compareItemByFilter = require('./compare');

module.exports = {
    resolveMultiReferences: function (fieldValue) {
        if (!Array.isArray(fieldValue)) {
            return [];
        }
        return fieldValue.map(inputPath => {
            try {
                return findByInputPath(inputPath);
            } catch (e) {
                console.warn(`Invalid Reference: ${inputPath}`)
                return null;
            }
        }).filter(e => !!e)
    },
    resolveReference: function (inputPath) {
        if (!inputPath) {
            return {};
        }
        try {
            return findByInputPath(inputPath);
        } catch (e) {
            console.warn(`Invalid Reference: ${inputPath}`)
            return {};
        }
    }, filter: function (array, fields, filterFor, inputPath) {
        if (!Array.isArray(array)) {
            return []
        }
        filterFor = filterFor || "ALL";
        inputPath = inputPath.replace('./', '');
        const filters = fields.replace(/DYN_CONTEXT/gm, inputPath).split("; ").map(f => f.split(",")).filter( el => el.length === 3);

        if (filterFor === "ALL") {
            return array.filter((item) => filters.every((filter) => compareItemByFilter(item,filter)))
        } else {
            return array.filter((item) => filters.some((filter) => compareItemByFilter(item,filter)))
        }
    }
}