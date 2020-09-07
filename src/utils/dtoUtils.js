const dtoUtils = {
  resolveFileResponse(response) {
    let result = response;
    if (typeof response === 'string') {
      const responseObject = JSON.parse(response);

      result = JSON.parse(responseObject.content);
    }

    return result;
  },
  resolveSuffix(fileName) {
    if (!fileName) {
      return '';
    }

    return fileName.substring(fileName.lastIndexOf('.') + 1);
  },
  isSuccess(response) {
    return Number(response.status) === 200
      || Number(response.statusCode) === 200
      || String(response.flag) === 'SUCCESS'
      ;
  },
};

export default dtoUtils;
