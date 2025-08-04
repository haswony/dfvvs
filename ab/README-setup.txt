إرشادات الإعداد والنشر لمتجر بلدروز

1) ربط Firebase بالمشروع
- افتح Firebase Console > مشروع baladroz-be563.
- Authentication > Sign-in method > فعّل Google.
- Realtime Database > أنشئ قاعدة بيانات في وضع Locked/Production.
- Storage > فعّل التخزين.

2) تطبيق قواعد الأمان (مهم)
Realtime Database rules:
{
  "rules": {
    "products": {
      ".read": true,
      "$id": {
        ".write": "auth != null && auth.token.email === 'alshmryh972@gmail.com'"
      }
    }
  }
}

Storage rules:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /product-images/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'alshmryh972@gmail.com';
    }
    match /{allPaths=**} {
      allow read: if true;
    }
  }
}

3) تشغيل محلياً
- افتح index.html مباشرة في المتصفح. على كروم، قد يتطلب ميزات آمنة للـ Analytics، يمكن تجاهلها.
- جرّب تسجيل الدخول من الصفحة الرئيسية. إذا كان بريدك هو المشرف، ستظهر لك "لوحة المشرف".

4) استخدام لوحة المشرف
- افتح admin.html.
- سجّل دخول بحساب Google الخاص بالمشرف: alshmryh972@gmail.com
- أدخل اسم، سعر، وصف، اختر صورة (اختياري)، ثم "حفظ المنتج".
- ستُرفع الصورة إلى Storage داخل المسار: product-images/{productId}/
- سيظهر المنتج في الصفحة الرئيسية وبقائمة الإدارة.

5) تحسينات SEO جاهزة
- عناوين، وصف، كلمات مفتاحية: بلدروز, قضاء بلدروز, منتجات بلدروز, متجر بلدروز
- JSON-LD من نوع Store، ووسوم Open Graph/Twitter.
- لتفعيل نطاق حقيقي: حدّث canonical و og:url في index.html.

ملاحظات
- لا توجد سلة شراء فعلية، زر "إضافة إلى السلة" يعطي تنبيه بسيط فقط.
- التصميم متجاوب وموجّه للجوال، اتجاه RTL، خط Tajawal (يعتمد على النظام، يمكن إضافة استيراد خط من Google Fonts إن رغبت).
- يمكنك تغيير الألوان من :root في styles.css.

ملفات المشروع
- index.html: الصفحة العامة لعرض المنتجات + تسجيل الدخول.
- admin.html: واجهة المشرف لإضافة/حذف المنتجات.
- styles.css: تنسيق حديث ومتجاوب.
- app.js: تهيئة Firebase، إدارة تسجيل الدخول.
- home.js: قراءة المنتجات وعرضها.
- admin.js: رفع الصور، إضافة المنتجات، قائمة الإدارة.
- manifest.webmanifest: إعدادات PWA أساسية.
- favicon.png: ضع أي شعار 192x192 بنفس الاسم في مجلد المشروع.
- assets/empty.svg: أيقونة حالة فارغة (اختيارية). أنشئ مجلد assets وضع ملف empty.svg أو غيّر المسار في index.html.

انتهى.
