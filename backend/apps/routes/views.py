"""경로 추천 API.

  POST /api/routes/recommend/
    { profile:{age,gender,car_type,car_age}, passenger, load_kg,
      origin, destination, mode, auto_recommend }
  → { origin, destination, mode, routes:[{route_id,title,reason,score,...}] }

실제 파이프라인은 services.recommend 에 있다. 설계: docs/FE_백엔드_연동_설계.md
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ai.adapters.geocode import search_places

from . import services


@api_view(['POST'])
def recommend(request):
    try:
        result = services.recommend(request.data)
    except services.RecommendError as exc:
        return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(result)


@api_view(['GET'])
def places(request):
    """장소 검색 — 출발지·도착지 입력 자동완성용.

    GET /api/routes/places/?q=강남역 → {places:[{name,address,lng,lat}, ...]}
    """
    query = request.query_params.get('q', '')
    if not query.strip():
        return Response({'places': []})
    return Response({'places': search_places(query)})
