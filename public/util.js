
exports.exculdeFields = {
    __v: false,
    _id: false
};


//changed
exports.createError = function(errEnum) {
    var err = new Error();
	//err.name is added to aid, winston logging. By default if object is instance of error, winston logs stack info & err.message, err.name.
	//Custom properties, in this case errorCode are not printed.
    err.name = errEnum.errorCode;
	err.errorCode = errEnum.errorCode;
    err.message = errEnum.message;
    return err;
  }

//

exports.showMessage=function showMessage(errMsg) {
    return { 'message': errMsg }
}


