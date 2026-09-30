<?php
/**
 * KOPIS API 중계 (Cafe24).
 *
 * 2026-09-30: 예전엔 브라우저가 `service=<KOPIS 키>`를 직접 붙여 보냈다 — 키가 NEXT_PUBLIC_ 로 빌드 JS에
 * 박혀 누구나 볼 수 있었다. 이제 키는 서버에서만 붙인다: kopis_proxy_config.php(git 제외, 배포 때 함께
 * 업로드) 또는 서버 환경변수 KOPIS_API_KEY. 브라우저가 service 를 보내도 무시하고 덮어쓴다.
 * 아무 경로나 중계하지 않도록 공연 API 경로만 허용한다.
 */

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$__configFile = __DIR__ . '/kopis_proxy_config.php';
if (file_exists($__configFile)) {
    require $__configFile;
}
$SERVICE_KEY = getenv('KOPIS_API_KEY') ?: (defined('KOPIS_API_KEY') ? KOPIS_API_KEY : '');
if ($SERVICE_KEY === '') {
    http_response_code(500);
    echo 'Error: KOPIS API key is not configured';
    exit();
}

$path = isset($_GET['path']) ? $_GET['path'] : '';
// 공연 목록(/pblprfr)과 상세(/pblprfr/<공연ID>)만 허용한다.
if (!preg_match('#^/pblprfr(/[A-Za-z0-9]+)?$#', $path)) {
    http_response_code(400);
    echo 'Error: Unsupported path';
    exit();
}

$queryParams = $_GET;
unset($queryParams['path']);
$queryParams['service'] = $SERVICE_KEY;

$fullUrl = 'https://www.kopis.or.kr/openApi/restful' . $path . '?' . http_build_query($queryParams);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $fullUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo 'Error: upstream request failed';
    exit();
}

http_response_code($httpCode);
header('Content-Type: application/xml; charset=utf-8');
echo $response;
?>
