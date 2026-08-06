from django.db import models


class DriverProfile(models.Model):
    """운전자 프로필 — 성향 추론 모델의 입력 스키마.

    ⚠️ passenger·load_kg 는 여정마다 바뀌는 값이라 **여정 입력(FE S2)** 으로 분리했다.
    여기엔 저장하지 않고(빈 값 허용), 추천 요청 시 프로필과 합쳐 모델 입력 6필드를 만든다.
    설계: docs/FE_백엔드_연동_설계.md
    """

    GENDER = [('M', '남'), ('F', '여')]
    PASSENGER = [
        ('alone', '혼자'),
        ('family', '가족'),
        ('vulnerable', '노약자'),  # 반려동물 포함
        ('friend', '친구'),
    ]
    CAR_TYPE = [
        ('sedan', '세단'),
        ('suv', 'SUV'),
        ('truck', '화물차'),
        ('compact', '경차'),
    ]

    # ── 고정 프로필 (FE S1에서 입력·저장) ──
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=1, choices=GENDER)
    car_type = models.CharField(max_length=20, choices=CAR_TYPE)
    car_age = models.PositiveIntegerField(default=0)   # 연식: 0 ~ 10 년

    # ── 여정별 값 (FE S2에서 매번 입력; 프로필엔 저장 안 함) ──
    passenger = models.CharField(max_length=20, choices=PASSENGER, blank=True, null=True)
    load_kg = models.PositiveIntegerField(blank=True, null=True)   # 짐: 0 ~ 100 kg

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'DriverProfile({self.age}/{self.gender}/{self.car_type}/{self.car_age}년)'
