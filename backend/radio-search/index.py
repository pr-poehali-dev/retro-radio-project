"""Прокси для Radio Browser API — поиск радиостанций по названию или тегу."""
import json
import urllib.request
import urllib.parse

RADIO_BROWSER_API = "https://de1.api.radio-browser.info/json"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    params = event.get("queryStringParameters") or {}
    mode = params.get("mode", "search")   # search | bytag
    query = params.get("q", "").strip()
    limit = params.get("limit", "30")

    if not query:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "query param 'q' is required"}),
        }

    if mode == "bytag":
        url = f"{RADIO_BROWSER_API}/stations/bytag/{urllib.parse.quote(query)}?limit={limit}&hidebroken=true&order=votes&reverse=true"
    else:
        url = f"{RADIO_BROWSER_API}/stations/search?name={urllib.parse.quote(query)}&limit={limit}&hidebroken=true&order=votes&reverse=true"

    req = urllib.request.Request(url, headers={"User-Agent": "RadiolaVEF/1.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())

    # Фильтруем: только HTTPS потоки
    filtered = [
        s for s in data
        if s.get("url_resolved", "").startswith("https")
    ]

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps(filtered),
    }
