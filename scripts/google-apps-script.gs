/**
 * Ground — 이메일 수집 Google Apps Script
 *
 * 설치 방법:
 * 1. Google Sheet → 확장 프로그램 → Apps Script
 * 2. 이 내용 전체 붙여넣기
 * 3. SHARED_SECRET 값을 Vercel 환경변수와 동일하게 설정
 * 4. 배포 → 새 배포 → 웹앱 (실행: 나, 액세스: 모든 사용자)
 * 5. 웹앱 URL을 Vercel GOOGLE_SHEETS_WEBHOOK_URL 에 등록
 */

const SHEET_NAME = 'emails';
const SHARED_SECRET = 'REPLACE_ME'; // Vercel 환경변수와 동일한 값

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SHARED_SECRET) {
      return _json({ ok: false, error: 'unauthorized' });
    }

    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);

    // 헤더 행이 없으면 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'timestamp', 'email', 'industry', 'region', 'consent',
        'utm_source', 'utm_medium', 'utm_campaign', 'referrer', 'user_agent'
      ]);
    }

    sheet.appendRow([
      new Date(),
      body.email       || '',
      body.industry    || '',
      body.region      || '',
      body.consent     ? 'true' : 'false',
      body.utm_source  || '',
      body.utm_medium  || '',
      body.utm_campaign|| '',
      body.referrer    || '',
      body.user_agent  || ''
    ]);

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
