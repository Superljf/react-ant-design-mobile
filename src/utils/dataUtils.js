const LOCAL_STORAGE_NAMESPACE = 'growthEvaluation';
import { ListView } from "antd-mobile";

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

  getListViewDataSource() {
    return new ListView.DataSource({
      getRowData: (dataBlob, sectionID, rowID) => {
        return dataBlob[sectionID][rowID];
      },
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
  },
  getListViewSectionDataSource() {
    return new ListView.DataSource({
      getRowData: (dataBlob, sectionID, rowID) => { const rowData = dataBlob[`${sectionID}Data`][rowID]; return { ...rowData, dataType: sectionID }; },
      getSectionHeaderData: (dataBlob, sectionID) => { return dataBlob[sectionID]; },
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
  },
};

export default dataUtils;
