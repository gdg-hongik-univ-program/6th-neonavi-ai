from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def recommend(request):
    """경로 추천 엔드포인트 (뼈대).

    흐름:
      1. 입력: 출발지·목적지 + 운전자 프로필
      2. 지도 API(Kakao/Naver)로 후보 경로 N개 조회
      3. Feature Engineering(곡률·경사·연비·통행료) 계산
      4. ai.inference.recommend_routes 로 성향 스코어링·랭킹
      5. 추천 경로 + 추천 이유 반환
    """
    # TODO: 지도 API 연동 + ai 모듈 호출
    return Response({'detail': 'not implemented', 'routes': []})
