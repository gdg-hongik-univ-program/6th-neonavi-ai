from django.db import models


class DriverProfile(models.Model):
    """운전자 프로필 — 성향 추론 모델의 입력 스키마."""

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

    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=1, choices=GENDER)
    passenger = models.CharField(max_length=20, choices=PASSENGER)
    car_type = models.CharField(max_length=20, choices=CAR_TYPE)
    load_kg = models.PositiveIntegerField(default=0)   # 짐: 0 ~ 100 kg
    car_age = models.PositiveIntegerField(default=0)   # 연식: 0 ~ 10 년
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'DriverProfile({self.age}/{self.gender}/{self.passenger}/{self.car_type})'
