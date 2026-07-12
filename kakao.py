import requests

REST_API_KEY = "faabb3e7df4eeaf12d4d5b93898a57e9"

url = "https://apis-navi.kakaomobility.com/v1/directions"

headers = {
    "Authorization": f"KakaoAK {REST_API_KEY}"
}

params = {
    "origin": "126.9256,37.5514",
    "destination": "126.9977,37.6109"
}

response = requests.get(url, headers=headers, params=params)

print(response.status_code)
print(response.text)