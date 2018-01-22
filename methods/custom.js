// Sets the table to required table and then returns the body parameters
const initializer = (req, Model) => {
    const reqBody = Object.assign({},req.body);
    const table = reqBody.table;
    if (table) {
        console.log('table: ', table);
        Model.selectTable(table);
	};
    return excludeProperties(reqBody,['table']);
};

const excludeProperties = (obj, keysArr)=> {
    console.log('obj: ', obj);
    const target = {};
    for (let prop in obj) {
        if (keysArr.indexOf(prop) >= 0) continue;
        if (!obj.hasOwnProperty(prop)) continue;
        target[prop] = obj[prop];
    }
    // console.log('\nTrimmed Object\n',target);
    return target;
};

const apiOperation = (req, res, Model, crudMethod)=> {
    const bodyParams = initializer(req, Method);
    crudMethod(bodyParams, (err, result) => {
        console.log('\ncallback name', crudMethod.name);
        console.log('\ndata\n', result);
        res.send(result);
    });
};

module.exports = {
    initializer,
    excludeProperties,
    apiOperation
}