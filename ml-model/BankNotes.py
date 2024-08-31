

from pydantic import BaseModel


class BankNote(BaseModel):
    Distance: float
    ShipmentType: int
    NumPackages: int
    SpecialHandling: int
    PackageWeight: float
