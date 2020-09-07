import yuyin from '../assets/yuyin.png';
import lianjie from '../assets/lianjie.png';
import doc from '../assets/fileIcon/word_icon_16px.png';
import xls from '../assets/fileIcon/excel_icon_16px.png';
import mp4 from '../assets/fileIcon/audio_icon_16px.png';
import pdf from '../assets/fileIcon/pdf_icon_16px.png';
import pic from '../assets/fileIcon/pic_icon_16px.png';
import ppt from '../assets/fileIcon/ppt_icon_16px.png';
import txt from '../assets/fileIcon/txt_icon_16px.png';
import unknow from '../assets/fileIcon/unknow_icon_16px.png';
import zip from '../assets/fileIcon/zip_icon_16px.png';
import share from '../assets/share.png';
import nativeApi from './nativeApi';

const loginHome = '';

const requestPath = {
  project: 'store',
  version: 'v2.0',
};

export const imgs = {
  yuyin,
  lianjie,
  doc,
  docx:doc,
  xls,
  xlsx:xls,
  mp4,
  pdf,
  jpg:pic,
  png:pic,
  gif:pic,
  jpeg:pic,
  ppt,
  txt,
  zip,
  rar:zip,
  unknow,
  share,
};

const fsPath = `${nativeApi.getFsPath()}v1.0/`;

const downloadPath = `${fsPath}downloadFile.file?fileUuid=`;

export  {
  requestPath,
  fsPath,
  loginHome,
  downloadPath,
};

