from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET', 'POST'])
def profile(request):
    """운전자 프로필 조회/저장 (뼈대). TODO: 직렬화·저장 구현."""
    return Response({'detail': 'not implemented'})
