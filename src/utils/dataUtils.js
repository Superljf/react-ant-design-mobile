const LOCAL_STORAGE_NAMESPACE = 'growthEvaluation';

const dataUtils = {
  castOrdinal(bool) {
    // cast boolean to number
    return bool ? 1: 0;
  },
  checkTrue(val) {
    // 检测number志
    if (val === '0') {
      return false;
    }

    return !!val;
  },
  filterBlank(str) {
    // 过滤空白符
    return str.replace(/ /g, '');
  },
  isArrayEmpty(array) {
    return !array || !array.length;
  },
  arrayPush(array, addArray, equalsField) {
    const newArray = [];

    addArray.forEach(destination => {
      let exist = false;
      array.forEach(origin => {
        if (destination[equalsField] === origin[equalsField]) {
          exist = true;
        }
      });

      if (!exist) {
        newArray.push(destination);
      }
    });

    return [...array, ...newArray];
  },
  getDataIndex(pagination, index) {
    const {
      current,
      pageSize,
    } = pagination;

    return (current - 1) * pageSize + index + 1;
  },
  maskDefaultText(string) {
    return this.maskText(string, 4, 3);
  },
  maskText(string, leftLen, rightLen) {
    if (!string) {
      return "";
    }

    const strLen = string.length;
    return strLen <= leftLen + rightLen ? string : `${string.substring(0, leftLen)}****${string.substring(strLen - rightLen - 1)}`;
  },
  range(start, end) {
    const array = [];

    for(let i = start; i <= end; i += 1) {
      array.push(i);
    }

    return array;
  },
  getData(key) {
    return window.localStorage.getItem(`${LOCAL_STORAGE_NAMESPACE}.${key}`);
  },
  setData(key, data) {
    window.localStorage.setItem(`${LOCAL_STORAGE_NAMESPACE}.${key}`, data);
  },
  hasMore(pagination) {
    return !(pagination.current * pagination.pageSize >= pagination.total);
  },
  filter(string) {
    if(!string) {
      return string;
    }

    return string.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
  },
};

export default dataUtils;
