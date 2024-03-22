module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'User not authorized')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static UserExists() {
        return new ApiError(400, 'User with the same name or email already exists');
    }

    static DataNotFound(message) {
        return new ApiError(404, message);
    }

    static IncompleteData(req) {
        let missingData = [];
        if (!req.body.facilityCode) missingData.push("facilityCode");
        if (!req.body.equipmentCode) missingData.push("equipmentCode");
        if (!req.body.quantity) missingData.push("quantity");

        missingData = missingData.join(', ');

        let message = 'Not all data was provided in the request. Missing fields: ';

        message = message + missingData;

        console.log(message);

        return new ApiError(400, message);
    }

    static BusinessLogicError(message) {
        return new ApiError(400, message);
    }

}
