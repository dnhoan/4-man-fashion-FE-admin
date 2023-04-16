// export const md5 = require('md5');
// export const xtype = require('xtypejs');

export const PAGE_SIZE = 10;

export const UNIT_LEVELS = [
  { level: 0, desc: 'Tỉnh/Thành phố' },
  { level: 1, desc: 'Quận/Huyện' },
  { level: 2, desc: 'Phường/Xã' },
];

export const STATUS_ALL = [
  { code: null, value: 'Tất cả' },
  { code: 'ACTIVE', value: 'Đang hoạt động' },
  { code: 'INACTIVE', value: 'Dừng hoạt động' },
];

export const VOUCHER_TYPE = {
  PERCENT: 1,
  MONEY: 0,
};
export const PURCHASE_TYPE = {
  ONLINE: 1,
  STORE: 0,
};
export const DELIVERY_STATUS = {
  DELIVERY: 1,
  NON_DELIVERY: 0,
};
export const ORDER_STATUS = {
  DRAFT: 0,
  PENDING: 1,
  CONFIRMED: 2,
  PACKAGING: 3,
  DELIVERING: 4,
  COMPLETE: 5,
  EXCHANGE: 6,
  CANCEL_ORDER: 7,
};
export const ORDER_DETAIL_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  RETURN_PENDING: 2,
  RETURN: 3,
  EXCHANGE_PENDING: 4,
  EXCHANGE: 5,
  REJECT_RETURN: 6,
  REJECT_EXCHANGE: 7,
};
export const APPLY_ALL = [
  { code: null, value: 'Tất cả', mapClass: '' },
  { code: true, value: 'Sử dụng', mapClass: 'ACTIVE' },
  { code: false, value: 'Không sử dụng', mapClass: 'INACTIVE' },
];

export const GENDER = [
  { code: 'MALE', value: 'Nam' },
  { code: 'FEMALE', value: 'Nữ' },
];

export const JOB_STATUS = [
  { code: 'PRE', value: 'Chờ xác nhận' },
  { code: 'NEW', value: 'Chờ xử lý' },
  { code: 'PROCESSING', value: 'Đang xử lý' },
  { code: 'SUCCESS', value: 'Thành công' },
  { code: 'UNSUCCESSFUL', value: 'Không thành công' },
  { code: 'ERROR', value: 'Lỗi' },
];

export const USER_TYPES = [
  { code: 'ADMIN', value: 'Quản lý' },
  { code: 'CUSTOMER', value: 'Khách hàng' },
  { code: 'EMPLOYEE', value: 'Nhân viên' },
];

export const DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm:ss';
export const DATE_TIME_FORMAT_0H = 'DD-MM-YYYY 00:00:00';

export const DATE_FORMAT = 'DD-MM-YYYY';
export const HOURS_FORMAT = 'HH:mm';
export const DD_MM_YYYY = 'DD/MM/YYYY';
export const REGEX_VN_PHONE =
  /^((((((\+|)84)|0)?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])\d{7})|(( 02)([4,8])(\d{8})))((,((((((\+|)84)|0)?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])\d{7})|((02)([4,8])(\d{8}))))*)$$/;
export const REGEX_MOBILE_PHONE =
  /^((((\+|)84)|0)?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/; // điện thoại di động;
export const REGEX_MULTI_MOBILE_PHONE =
  /^((((\+|)84)|0)?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])\d{7}(,((((\+|)84)|0)?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])\d{7})*$/;
export const REGEX_LINE_PHONE = /^(02)([4,8])(\d{8})$/; // số điện thoại cố định;
export const REGEX_YEAR = /^(19|20)(\d{2})$/;
export const REGEX_VIETNAMESE =
  /^[a-zA-Z\dàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ ]*$/;
export const REGEX_POINT_VALUE =
  /^[a-zA-Z,.\dàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ ]*$/;
export const REGEX_VIETNAMESE_NO_NUMBER =
  /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ ]*$/;
export const REGEX_VIETNAMESE_WITHOUT_ACCENTS = /^[a-zA-Z ]*$/;
export const REGEX_EMAIL_PATTERN = /^[a-z\d._%+-]+@[a-z\d.-]+\.[a-z]{2,4}$/;
export const REGEX_EMAIL = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const REGEX_NUMBER = /^\d*$/;
export const REGEX_DOUBLE = /^[0-9]+\.?[0-9]*$/;
export const REGEX_NO_SPECIAL_CHARACTERS = /^[A-Z\da-z- ]*$/;
export const REGEX_LICENSE_PLATE = /^[A-Z\da-z- ]*$/;
export const REGEX_CODE = /^\w*$/;
export const REGEX_LEGAL_ID = /^([a-z\d]{8}|[a-z\d]{9}|[a-z\d]{12})$/;
export const REGEX_VALIDATE_SEARCH = /[$^*)(+{}|?]|]|\[/g;
export const REGEX_VALIDATE_URL_WITHOUT_HTTP =
  /^[-a-zA-Z0-9@:%._~#=]{1,256}\.[.vn](?:[-a-zA-Z0-9()@:%_.~#?&//=]*)$/;
export const REGEX_VALIDATE_URL_WITH_HTTP =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[.vn](?:[-a-zA-Z0-9()@:%_.~#?&//=]*)$/;
export const REGEX_VIETNAMESE_AND_SPECIAL_CHARACTERS =
  /^[a-zA-Z\dàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ ]*/;

export const USE_FINAL_SCORE: Array<{ code: string; name: string }> = [
  {
    code: 'true',
    name: 'Có',
  },
  {
    code: 'false',
    name: 'Không',
  },
];

// Cấu hình thông tin thời khóa biểu
export const APP_PARAM_TYPE = {
  TIME_TABLE_CFG: 'TIME_TABLE_CFG',
};

export const REGEX_HOUR = /^([0-1]\d|2[0-3])+:[0-5]\d$/;

export const INPUT_TEXT_CLASS =
  'block w-full rounded border border-solid border-gray-400 bg-white bg-clip-padding px-2 py-1.5 text-sm font-normal text-gray-700 focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none';
export const BUTTON_CLASS =
  'inline-flex items-center rounded-md border border-transparent bg-rose-600 px-2 py-1 text-sm font-normal text-white shadow-sm hover:bg-rose-800 focus:outline-none';
export const BUTTON_CANCEL_CLASS =
  'inline-flex items-center rounded-md border border-transparent bg-gray-600 px-2 py-1 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
export const UPLOAD_AREA_CLASS =
  'relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';
export const SELECT_CLASS =
  'block w-full rounded border-solid border-gray-400 bg-white bg-clip-padding text-sm font-normal text-gray-700 focus:outline-none';
export const TOGGLE_CLASS =
  'mx-1 inline-flex items-center rounded-full border border-transparent bg-blue-600 p-1 text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';
export const TOGGLE_CLASS_DISABLED =
  'mx-1 inline-flex items-center rounded-full border border-transparent bg-gray-600 p-1 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';
export const HEADER_BUTTON_CLASS =
  'p-button-sm p-button-outlined p-button-rounded p-button-danger p-0';
export const INPUT_CALENDAR_CLASS =
  'block w-full border-gray-400 bg-white bg-clip-padding py-1 text-sm font-normal text-gray-700 focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none';

export const SERVER_ERROR_CODES: Array<{
  code: string;
  name: string;
  message: string;
}> = [
  {
    code: '000',
    name: 'OK',
    message: 'OK',
  },
  {
    code: '001',
    name: 'Unhandled error',
    message: 'Hệ thống xảy ra lỗi',
  },
  {
    code: '002',
    name: 'Object not found',
    message: 'Dữ liệu không chính xác',
  },
  {
    code: '003',
    name: 'Object already exist',
    message: 'Dữ liệu đã tồn tại trên hệ thống',
  },
  {
    code: '004',
    name: 'Tenant  not found or inactive',
    message: 'Dữ liệu trường không đã tồn tại hoặc đang dừng hoạt động',
  },
  {
    code: '005',
    name: 'Field must is null',
    message: 'Trường thông tin phải để trống',
  },
  {
    code: '006',
    name: 'Application not found or inactive',
    message: 'Hệ thống xảy ra lỗi',
  },
  {
    code: '007',
    name: 'Method argument not valid',
    message: 'Tham số không chính xác',
  },
  {
    code: 'AUTH_001',
    name: 'User or Password invalid',
    message: 'Thông tin đăng nhập không chính xác',
  },
  {
    code: '008',
    name: 'Update Fail, Object already exist',
    message: 'Cập nhật thất bại, dữ liệu đã tồn tại trên hệ thống',
  },
  {
    code: '009',
    name: 'Internal Server Error',
    message: 'Hệ thống xảy ra lỗi',
  },
  {
    code: '010',
    name: 'Object can not update',
    message: 'Dữ liệu không được phép cập nhật',
  },
  {
    code: '011',
    name: 'Upload file has error',
    message: 'Lỗi trong quá trình upload file',
  },
  {
    code: '012',
    name: 'Object not found or inactive',
    message: 'Dữ liệu không tồn tại hoặc đã dừng hoạt động',
  },
  {
    code: '013',
    name: 'Can not update',
    message: 'Dữ liệu không được phép cập nhật',
  },
  {
    code: '409',
    name: 'Duplicate unique params',
    message: 'Trùng lặp tham số trên hệ thống',
  },
  {
    code: '014',
    name: 'Synchronized Failed',
    message: 'Đồng bộ thất bại',
  },
  {
    code: '016',
    name: 'Conflict role name',
    message: 'Dữ liệu quyền không hợp lệ',
  },
  {
    code: '017',
    name: 'File type invalid',
    message: 'Định dạng file không hợp lệ',
  },
  {
    code: '018',
    name: 'File content invalid',
    message: 'Cấu trúc file không hợp lệ',
  },
  {
    code: '020',
    name: 'Call google service has error',
    message: 'Hệ thống xảy ra lỗi',
  },
  {
    code: '025',
    name: 'Duplicate unique value in file content',
    message: 'Tham số đã tồn tại trong file',
  },
  {
    code: '050',
    name: 'File content greater than 5000 records',
    message: 'Nội dung file upload không được quá 5000 dòng',
  },
  {
    code: '051',
    name: 'File is empty',
    message: 'Nội dung file không chính xác',
  },
  {
    code: '045',
    name: 'Object cannot delete',
    message: 'Dữ liệu không được phép xóa',
  },
];

export const YES_NO_ARRAY = [
  { code: true, value: 'Có' },
  { code: false, value: 'Không' },
];

export const USER_TYPE = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  EMPLOYEE: 'EMPLOYEE',
};

export const MAX_FILE_SIZE = 5_242_880; // (in bytes)

export const justFinishedMsg = 'Vừa xong';
export const finishedInMinutes = '$minutes phút trước';
export const finishedInHours = '$hours tiếng trước';

export const DialogStyle = {
  style: {
    borderRadius: '16px',
  },
  header: {
    borderRadius: '16px 16px 0px 0px',
  },
  content: {
    borderRadius: '0px 0px 16px 16px',
  },
};

export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'INACTIVE';
