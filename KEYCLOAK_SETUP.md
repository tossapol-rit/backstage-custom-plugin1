# Backstage Keycloak Authentication Setup

## Configuration Summary

การตั้งค่า Backstage เพื่อใช้งาน Keycloak authentication เสร็จสมบูรณ์แล้ว

### Keycloak Configuration
- **URL**: http://localhost:18080
- **Realm**: backstage
- **Client ID**: backstage
- **User**: demo/demo

### Files Changed

1. **app-config.yaml**: เพิ่ม OIDC provider configuration
2. **packages/backend/src/plugins/auth/keycloak.ts**: สร้าง Keycloak authenticator
3. **packages/backend/src/plugins/auth/module.ts**: สร้าง backend module
4. **packages/backend/src/index.ts**: เพิ่ม Keycloak auth module
5. **packages/app/src/App.tsx**: เพิ่ม Keycloak ใน SignInPage
6. **examples/org.yaml**: เพิ่ม demo user entity

### Environment Variables Required

ต้องตั้งค่า environment variable ดังนี้:

```bash
export KEYCLOAK_CLIENT_SECRET="your-keycloak-client-secret"
```

**วิธีหา Client Secret จาก Keycloak:**
1. เข้า Keycloak Admin Console: http://localhost:18080/admin
2. เลือก Realm: backstage
3. ไปที่ Clients > backstage
4. คลิกที่ tab "Credentials"
5. คัดลอก Client Secret

### How to Start

```bash
# 1. ตั้งค่า environment variable
export KEYCLOAK_CLIENT_SECRET="your-secret-here"

# 2. Start Backstage
yarn dev
```

### Testing the Integration

1. เปิด browser ไปที่ http://localhost:3000
2. คุณจะเห็นปุ่ม "Sign in using Keycloak"
3. คลิกเพื่อ redirect ไปยัง Keycloak
4. Login ด้วย username: `demo` และ password: `demo`
5. หลังจาก login สำเร็จจะ redirect กลับมาที่ Backstage

### Troubleshooting

หากพบปัญหา:

1. ตรวจสอบว่า Keycloak ทำงานอยู่ที่ http://localhost:18080
2. ตรวจสอบว่า Client Secret ถูกต้อง
3. ตรวจสอบ Valid Redirect URIs ใน Keycloak Client Settings:
   - http://localhost:7007/api/auth/oidc/handler/frame
4. ตรวจสอบ Web Origins ใน Keycloak:
   - http://localhost:3000
5. ตรวจสอบว่า Standard Flow ถูก enable ใน Capability config
