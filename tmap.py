import requests
import json

APP_KEY = "iWc7uDvmEr6uhk7FLXUg53sP900xED5M4SYAmGY6"

url = "https://apis.openapi.sk.com/tmap/routes"

headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "appKey": APP_KEY
}

payload = {
    "startX": "126.9256",
    "startY": "37.5514",
    "endX": "126.9977",
    "endY": "37.6109",
    "startName": "홍익대학교",
    "endName": "국민대학교"
}

response = requests.post(url, headers=headers, json=payload)

print(response.status_code)

if response.status_code == 200:
    data = response.json()

    with open("route.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print("route.json 저장 완료")
else:
    print(response.text)