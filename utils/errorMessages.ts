export const ERROR_MESSAGES = {
  PROFILE: {
    LOAD_FAILED: 'فشل في تحميل بيانات الملف الشخصي',
    UPDATE_FAILED: 'فشل في تحديث الملف الشخصي',
    DELETE_FAILED: 'فشل في حذف الحساب',
    INVALID_DATA: 'يرجى ملء جميع الحقول المطلوبة',
    UNAUTHORIZED: 'غير مخول للوصول',
  },
  IMAGE: {
    PICK_FAILED: 'فشل في اختيار الصورة',
    UPLOAD_FAILED: 'فشل في رفع الصورة',
    PERMISSION_DENIED: 'يرجى السماح بالوصول إلى الصور من إعدادات التطبيق',
    INVALID_FORMAT: 'تنسيق الصورة غير مدعوم',
  },
  AUTH: {
    REQUIRES_RECENT_LOGIN: 'من فضلك سجل الدخول مرة أخرى قبل مسح الحساب',
    ACCOUNT_DELETE_FAILED: 'حدث خطأ أثناء حذف الحساب',
    USER_NOT_AUTHENTICATED: 'المستخدم غير مخول',
  },
  GENERAL: {
    NETWORK_ERROR: 'خطأ في الاتصال بالإنترنت',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
    OPERATION_CANCELLED: 'تم إلغاء العملية',
  },
} as const;

export const SUCCESS_MESSAGES = {
  PROFILE: {
    UPDATE_SUCCESS: 'تم تحديث الملف الشخصي بنجاح',
    DELETE_SUCCESS: 'تم حذف الحساب بنجاح',
  },
  IMAGE: {
    UPLOAD_SUCCESS: 'تم رفع الصورة بنجاح',
  },
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;
